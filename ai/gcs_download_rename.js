// Usage:
//   node gcs_download_rename.js <bucket> <gcsPrefix> <localDir> [--rename-in-gcs]
//
// Пример:
//   node gcs_download_rename.js my-pdd-bucket out/ ./translated --rename-in-gcs
//
// Делает:
//  - скачивает все *.txt из gs://bucket/<gcsPrefix> в <localDir>, сохраняя как *.json
//  - опционально переименовывает объекты в GCS (*.txt -> *.json)

import path from "path";
import fs from "fs";
import { Storage } from "@google-cloud/storage";

async function main() {
  const [bucketName, gcsPrefix, localDir, flag] = process.argv.slice(2);
  const renameInGcs = flag === "--rename-in-gcs";

  if (!bucketName || !gcsPrefix || !localDir) {
    console.error("Usage: node gcs_download_rename.js <bucket> <gcsPrefix> <localDir> [--rename-in-gcs]");
    process.exit(1);
  }

  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const prefix = gcsPrefix.endsWith("/") ? gcsPrefix : gcsPrefix + "/";

  await fs.promises.mkdir(localDir, { recursive: true });

  // собираем список объектов под префиксом
  const [files] = await bucket.getFiles({ prefix });
  const targets = files.filter(f => f.name.endsWith(".txt") && !f.name.endsWith("/index.csv"));

  if (!targets.length) {
    console.log("Ничего не найдено (*.txt) под префиксом", prefix);
    return;
  }

  console.log(`Найдено txt-файлов: ${targets.length}`);

  for (const file of targets) {
    const baseTxt = path.posix.basename(file.name);               // например: chunk-01_ru_translated.txt
    const baseJson = baseTxt.replace(/\.txt$/i, ".json");          // -> chunk-01_ru_translated.json
    const localPath = path.join(localDir, baseJson);

    // скачать локально как .json
    await file.download({ destination: localPath });
    console.log("⬇️  Downloaded →", localPath);

    if (renameInGcs) {
      const newGcsName = file.name.replace(/\.txt$/i, ".json");    // gs://.../chunk-01_ru_translated.json
      await file.copy(bucket.file(newGcsName));
      await file.delete();
      console.log("🔁 Renamed in GCS:", file.name, "→", newGcsName);
    }
  }

  // index.csv может пригодиться — тоже скачаем как есть (если есть)
  const indexCsv = files.find(f => path.posix.basename(f.name) === "index.csv");
  if (indexCsv) {
    const dest = path.join(localDir, "index.csv");
    await indexCsv.download({ destination: dest });
    console.log("⬇️  Downloaded index.csv →", dest);
  }

  console.log("✅ Готово");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
