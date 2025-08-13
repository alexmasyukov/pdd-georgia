// rehydrate_from_batch.js
// Usage:
//   node rehydrate_from_batch.js <srcChunksDir> <bucket> <outPrefix> <localOutDir> <mergedOutPath>
//
// Пример:
//   node rehydrate_from_batch.js ./chunks my-pdd-bucket out ./translated ./output.ru.json
import fs from "fs";
import path from "path";
import { Storage } from "@google-cloud/storage";

function restoreText(s) {
  // вернём переводы строк: ↵ -> \n
  return s.replace(/↵/g, "\n");
}

// извлекаем базовое имя чанка вида "chunk-01" из любого имени файла
function extractChunkBase(filename) {
  // ищем "chunk-" + 1..3 цифры (подгони при необходимости)
  const m = filename.match(/chunk-\d{1,3}/i);
  return m ? m[0].toLowerCase() : null;
}

// парсим строку формата: <<<ID=...>>>\tTEXT...
function parseLine(line) {
  const m = line.match(/^<<<ID=(.+?)>>>\t(.*)$/);
  if (!m) return null;
  const idRaw = m[1].trim();
  const text = restoreText(m[2] ?? "");
  const id = /^\d+$/.test(idRaw) ? Number(idRaw) : idRaw;
  return { id, text };
}

async function main() {
  const [srcDir, bucketName, outPrefixArg, localOutDir, mergedOutFile] = process.argv.slice(2);
  if (!srcDir || !bucketName || !outPrefixArg || !localOutDir || !mergedOutFile) {
    console.error("Usage: node rehydrate_from_batch.js <srcChunksDir> <bucket> <outPrefix> <localOutDir> <mergedOutPath>");
    process.exit(1);
  }
  const outPrefix = outPrefixArg.endsWith("/") ? outPrefixArg : outPrefixArg + "/";

  const storage = new Storage();
  const bucket = storage.bucket(bucketName);

  const rawDir = path.join(localOutDir, "raw");
  const outJsonDir = path.join(localOutDir, "json");
  await fs.promises.mkdir(rawDir, { recursive: true });
  await fs.promises.mkdir(outJsonDir, { recursive: true });

  // 1) скачать все .txt результаты локально
  const [files] = await bucket.getFiles({ prefix: outPrefix });
  const outTxt = files.filter(f => f.name.toLowerCase().endsWith(".txt"));
  if (!outTxt.length) {
    console.error("Не найдено *.txt в выходном префиксе:", outPrefix);
    process.exit(1);
  }

  for (const f of outTxt) {
    const localName = path.posix.basename(f.name);
    const localPath = path.join(rawDir, localName);
    await f.download({ destination: localPath });
    console.log("⬇️  downloaded:", localPath);
  }

  // 2) построим карты: baseChunk -> Map(id -> text)
  const perFileMaps = new Map(); // base -> Map(id->text)
  const rawNames = (await fs.promises.readdir(rawDir)).filter(n => n.toLowerCase().endsWith(".txt")).sort();

  for (const fname of rawNames) {
    const base = extractChunkBase(fname);
    if (!base) {
      console.warn(`⚠️  Не удалось извлечь имя чанка из: ${fname} — пропускаю`);
      continue;
    }
    const content = await fs.promises.readFile(path.join(rawDir, fname), "utf8");
    const m = new Map();
    for (const line of content.split(/\n/)) {
      const t = line.trim();
      if (!t) continue;
      const rec = parseLine(t);
      if (!rec) continue;
      m.set(rec.id, rec.text);
    }
    perFileMaps.set(base, m);
  }

  // 3) прочитаем исходные чанки и соберём выход по каждому
  const chunkFiles = (await fs.promises.readdir(srcDir))
    .filter(f => f.toLowerCase().endsWith(".json"))
    .sort();

  const merged = [];
  for (const fname of chunkFiles) {
    const base = extractChunkBase(fname);
    const srcPath = path.join(srcDir, fname);
    const src = JSON.parse(await fs.promises.readFile(srcPath, "utf8"));
    if (!Array.isArray(src)) {
      console.warn(`⚠️  Source ${fname} не массив, пропускаю`);
      continue;
    }

    const map = perFileMaps.get(base);
    if (!map) {
      console.warn(`⚠️  Нет перевода для ${base}, пропускаю`);
      continue;
    }

    const outArr = src.map(it => ({
      id: it.id,
      question_explained: map.get(it.id) ?? "",
    }));

    // пофайловый JSON
    const outPath = path.join(outJsonDir, `${base}.ru.json`);
    await fs.promises.writeFile(outPath, JSON.stringify(outArr, null, 2), "utf8");
    console.log("🧩 built:", outPath);

    merged.push(...outArr);
  }

  await fs.promises.writeFile(mergedOutFile, JSON.stringify(merged, null, 2), "utf8");
  console.log(`✅ merged: ${mergedOutFile} (items: ${merged.length})`);
}

main().catch(e => { console.error(e); process.exit(1); });
