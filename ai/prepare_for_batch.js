// prepare_for_batch.js
// Usage:
//   node prepare_for_batch.js <srcChunksDir> <bucket> <inPrefix> <localTxtDir>
//
// Пример:
//   node prepare_for_batch.js ./chunks_original my-pdd-bucket in-txt ./_txt

import fs from "fs";
import path from "path";
import { Storage } from "@google-cloud/storage";

async function main() {
  const [srcDir, bucketName, inPrefixArg, localTxtDir] = process.argv.slice(2);
  if (!srcDir || !bucketName || !inPrefixArg || !localTxtDir) {
    console.error("Usage: node prepare_for_batch.js <srcChunksDir> <bucket> <inPrefix> <localTxtDir>");
    process.exit(1);
  }
  const inPrefix = inPrefixArg.endsWith("/") ? inPrefixArg : inPrefixArg + "/";
  await fs.promises.mkdir(localTxtDir, { recursive: true });

  const storage = new Storage();
  const bucket = storage.bucket(bucketName);

  const files = (await fs.promises.readdir(srcDir)).filter(f => f.endsWith(".json")).sort();
  if (!files.length) {
    console.error("В папке нет *.json чанков:", srcDir);
    process.exit(1);
  }

  for (const fname of files) {
    const srcPath = path.join(srcDir, fname);
    const chunk = JSON.parse(await fs.promises.readFile(srcPath, "utf8"));
    if (!Array.isArray(chunk)) {
      throw new Error(`Файл ${fname} не массив`);
    }

    const lines = chunk.map(it => {
      const id = it.id;
      const txt = (it.question_explained ?? "").toString();
      // Уберём \r, заменим табы на один пробел, реальные переводы строк сохраним как ↵ (потом восстановим при желании)
      const safe = txt.replace(/\r/g, "").replace(/\t/g, " ").replace(/\n/g, "↵");
      return `<<<ID=${id}>>>\t${safe}`;
    });

    const base = fname.replace(/\.json$/i, "");
    const localTxtPath = path.join(localTxtDir, `${base}.txt`);
    await fs.promises.writeFile(localTxtPath, lines.join("\n"), "utf8");
    console.log("📝 made:", localTxtPath);

    const gcsName = `${inPrefix}${base}.txt`;
    await bucket.upload(localTxtPath, { destination: gcsName, contentType: "text/plain; charset=utf-8" });
    console.log("☁️  uploaded:", `gs://${bucketName}/${gcsName}`);
  }

  console.log("✅ Готово: экстракция и загрузка.");
}

main().catch(e => { console.error(e); process.exit(1); });
