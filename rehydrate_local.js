// Usage:
//   node rehydrate_local.js <srcChunksDir> <localRawTxtDir> <outJsonDir> <mergedOutPath>
//
// Пример:
//   node rehydrate_local.js ./chunks ./translated/raw ./translated/json ./output.ru.json
//
// Что делает:
//  - читает все *.txt из <localRawTxtDir> (уже скачанные batch-результаты)
//  - парсит строки вида: <<<ID=123>>>\tTEXT...
//  - сопоставляет файлам исходных чанков по шаблону "chunk-\\d+"
//  - пишет пофайловые JSONы в <outJsonDir> и общий объединённый файл

import fs from "fs";
import path from "path";

function restoreText(s) {
  return s.replace(/\r/g, "").replace(/↵/g, "\n");
}

// извлекаем базовое имя чанка "chunk-01" из любого имени файла
function extractChunkBase(filename) {
  const m = filename.match(/chunk-\d{1,4}/i);
  return m ? m[0].toLowerCase() : null;
}

// терпимый парсер строки: <<<ID=...>>>\tTEXT...
function parseLine(line) {
  if (!line) return null;
  let t = line.replace(/^\uFEFF/, "").trim(); // BOM + trim
  // иногда batch заворачивает строку в кавычки
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1).trim();
  }
  // <<< ... >>> затем любой пробел/таб и текст
  const m = t.match(/^<{3}\s*([^>]+?)\s*>{3}[\t ]*(.*)$/);
  if (!m) return null;
  const inside = m[1];              // "ID=1782" или "ID = 1782"
  const payload = m[2] ?? "";
  const eq = inside.split("=");
  if (eq.length < 2) return null;
  const idRaw = eq.slice(1).join("=").trim();
  const id = /^\d+$/.test(idRaw) ? Number(idRaw) : idRaw;
  return { id, text: restoreText(payload) };
}

async function main() {
  const [srcDir, localRawDir, outJsonDir, mergedOutFile] = process.argv.slice(2);
  if (!srcDir || !localRawDir || !outJsonDir || !mergedOutFile) {
    console.error("Usage: node rehydrate_local.js <srcChunksDir> <localRawTxtDir> <outJsonDir> <mergedOutPath>");
    process.exit(1);
  }

  await fs.promises.mkdir(outJsonDir, { recursive: true });

  // 1) построй карты: base -> Map(id -> text) из локальных TXT
  const perFileMaps = new Map();
  const rawNames = (await fs.promises.readdir(localRawDir))
    .filter(n => n.toLowerCase().endsWith(".txt"))
    .sort();

  if (!rawNames.length) {
    console.error("В папке raw нет *.txt:", localRawDir);
    process.exit(1);
  }

  for (const fname of rawNames) {
    const base = extractChunkBase(fname);
    if (!base) {
      console.warn(`⚠️  Не удалось извлечь имя чанка из: ${fname} — пропускаю`);
      continue;
    }
    const content = await fs.promises.readFile(path.join(localRawDir, fname), "utf8");
    const map = new Map();
    let bad = 0, shown = 0;
    for (const line of content.split(/\n/)) {
      const rec = parseLine(line);
      if (!rec) {
        bad += line.trim() ? 1 : 0;
        if (shown < 5 && line.trim()) {
          console.warn(`  · не распарсил строку (${fname}):`, line.slice(0, 160));
          shown++;
        }
        continue;
      }
      map.set(rec.id, rec.text);
    }
    console.log(`📦 ${fname}: parsed=${map.size}${bad ? `, skipped=${bad}` : ""}`);
    perFileMaps.set(base, map);
  }

  // 2) пройди по исходным чанкам и собери json
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

    const outPath = path.join(outJsonDir, `${base}.ru.json`);
    await fs.promises.writeFile(outPath, JSON.stringify(outArr, null, 2), "utf8");
    console.log("🧩 built:", outPath);

    merged.push(...outArr);
  }

  await fs.promises.writeFile(mergedOutFile, JSON.stringify(merged, null, 2), "utf8");
  console.log(`✅ merged: ${mergedOutFile} (items: ${merged.length})`);
}

main().catch(e => { console.error(e); process.exit(1); });
