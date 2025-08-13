// gcs_copy_json_to_txt.js
import { Storage } from '@google-cloud/storage';

(async () => {
  const storage = new Storage();
  const bucketName = 'my-pdd-bucket';
  const srcPrefix = 'in/';
  const dstPrefix = 'in-txt/';

  const [files] = await storage.bucket(bucketName).getFiles({ prefix: srcPrefix });
  for (const f of files) {
    if (!f.name.endsWith('.json')) continue;
    const base = f.name.slice(srcPrefix.length, -5); // без 'in/' и '.json'
    const dstName = `${dstPrefix}${base}.txt`;
    console.log(`${f.name} -> ${dstName}`);
    await storage.bucket(bucketName).file(f.name)
      .copy(storage.bucket(bucketName).file(dstName));
  }
})();
