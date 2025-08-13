// run_batch.js
// Usage:
//   node run_batch.js <bucket> <inPrefix> <outPrefix> [sourceLang] [targetLang]
//
// Пример:
//   node run_batch.js my-pdd-bucket in-txt out ka ru

import { v3 } from "@google-cloud/translate";
import { Storage } from "@google-cloud/storage";

async function main() {
  const [bucketName, inPrefixArg, outPrefixArg, source = "ka", target = "ru"] = process.argv.slice(2);
  if (!bucketName || !inPrefixArg || !outPrefixArg) {
    console.error("Usage: node run_batch.js <bucket> <inPrefix> <outPrefix> [source] [target]");
    process.exit(1);
  }
  const inPrefix = inPrefixArg.endsWith("/") ? inPrefixArg : inPrefixArg + "/";
  const outPrefix = outPrefixArg.endsWith("/") ? outPrefixArg : outPrefixArg + "/";

  const storage = new Storage();
  const [files] = await storage.bucket(bucketName).getFiles({ prefix: inPrefix });
  const uris = files.filter(f => f.name.endsWith(".txt")).map(f => `gs://${bucketName}/${f.name}`);
  if (!uris.length) {
    console.error("Нет входных .txt по префиксу", inPrefix);
    process.exit(1);
  }
  if (uris.length > 100) {
    throw new Error(`Batch принимает до 100 файлов. Сейчас: ${uris.length}`);
  }

  const client = new v3.TranslationServiceClient();
  const parent = `projects/${process.env.GOOGLE_CLOUD_PROJECT}/locations/global`;

  const inputConfigs = uris.map(uri => ({ gcsSource: { inputUri: uri }, mimeType: "text/plain" }));
  const outputConfig = { gcsDestination: { outputUriPrefix: `gs://${bucketName}/${outPrefix}` } };

  console.log("Старт batchTranslateText...");
  console.log("Файлов:", uris.length);

  const [operation] = await client.batchTranslateText({
    parent,
    sourceLanguageCode: source,
    targetLanguageCodes: [target],
    inputConfigs,
    outputConfig,
  });

  console.log("Операция:", operation.name);
  const [resp] = await operation.promise();
  console.log("✅ Done:", {
    totalCharacters: resp.totalCharacters,
    translatedCharacters: resp.translatedCharacters,
    submitTime: resp.submitTime,
    endTime: resp.endTime,
  });
  console.log(`Результаты: gs://${bucketName}/${outPrefix}...`);
}

main().catch(e => { console.error(e); process.exit(1); });
