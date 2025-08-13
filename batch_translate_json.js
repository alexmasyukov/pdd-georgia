// batch_translate_json.js
// Usage:
//   node batch_translate_json.js gs://my-pdd-bucket/in/ gs://my-pdd-bucket/out/ ka ru
//
// Переводит ВСЕ файлы в входной папке (до 100 штук за один вызов)
// Требует: GOOGLE_APPLICATION_CREDENTIALS и GOOGLE_CLOUD_PROJECT в env.

import {v3} from "@google-cloud/translate";
import {Storage} from "@google-cloud/storage";

async function main() {
  const [inPrefix, outPrefix, source = "ka", target = "ru"] = process.argv.slice(2);
  if (!inPrefix || !outPrefix) {
    console.error("Usage: node batch_translate_json.js <gs://bucket/in/> <gs://bucket/out/> [source] [target]");
    process.exit(1);
  }

  // соберём список файлов в inPrefix
  const {bucket: inBucket, prefix: inPath} = parseGcsPrefix(inPrefix);
  const storage = new Storage();
  const [files] = await storage.bucket(inBucket).getFiles({prefix: inPath});
  const uris = files
    .filter(f => f.name && f.name.endsWith(".txt"))
    .map(f => `gs://${inBucket}/${f.name}`);

  if (!uris.length) {
    console.error("Нет входных .txt файлов по указанному префиксу");
    process.exit(1);
  }
  if (uris.length > 100) {
    console.error(`Слишком много файлов (${uris.length}). Batch API принимает до 100 за раз.`);
    process.exit(1);
  }

  const client = new v3.TranslationServiceClient();
  const parent = `projects/${process.env.GOOGLE_CLOUD_PROJECT}/locations/global`;

  const inputConfigs = uris.map(uri => ({
    gcsSource: {inputUri: uri},
    mimeType: "text/plain", // JSON обрабатываем как обычный текст (UTF-8)
  }));

  const outputConfig = {gcsDestination: {outputUriPrefix: outPrefix.endsWith("/") ? outPrefix : outPrefix + "/"}};

  console.log("Старт batchTranslateText...");
  console.log("Файлов:", uris.length);
  const request = {
    parent,
    sourceLanguageCode: source,
    targetLanguageCodes: [target],
    inputConfigs,
    outputConfig,
    // optionally: models, glossaries
  };

  const [operation] = await client.batchTranslateText(request);
  console.log("Операция запущена:", operation.name);
  const [response] = await operation.promise();
  console.log("Готово. Статистика:", {
    totalCharacters: response.totalCharacters,
    translatedCharacters: response.translatedCharacters,
    submitTime: response.submitTime,
    endTime: response.endTime,
  });

  console.log(`Результаты лежат в: ${outPrefix}`);
  console.log("Файлы будут в подкаталоге, который создаёт сервис (с UUID), внутри будут архивы/файлы с переводом.");
}

function parseGcsPrefix(uri) {
  if (!uri.startsWith("gs://")) throw new Error("Ожидается gs:// префикс");
  const s = uri.slice(5);
  const slash = s.indexOf("/");
  if (slash < 0) return {bucket: s, prefix: ""};
  const bucket = s.slice(0, slash);
  let prefix = s.slice(slash + 1);
  if (prefix && !prefix.endsWith("/")) prefix += "/";
  return {bucket, prefix};
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
