import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the input file
const inputFile = path.join(__dirname, 'ru.json');
const outputFile = path.join(__dirname, 'ru-filtered.json');

try {
  // Read and parse the JSON file
  const data = fs.readFileSync(inputFile, 'utf8');
  const items = JSON.parse(data);
  
  // Extract only id and question_explained fields
  const filtered = items.map(item => ({
    id: item.id,
    question_explained: item.question_explained
  }));
  
  // Write the filtered data to a new file
  fs.writeFileSync(outputFile, JSON.stringify(filtered, null, 2), 'utf8');
  
  console.log(`✓ Successfully extracted ${filtered.length} items`);
  console.log(`✓ Output saved to: ${outputFile}`);
} catch (error) {
  console.error('Error processing file:', error.message);
  process.exit(1);
}