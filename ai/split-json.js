import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const inputFile = path.join(__dirname, 'ru-filtered.json');
const outputDir = path.join(__dirname, 'chunks');
const chunkSize = 100;

try {
  // Read and parse the input file
  const data = fs.readFileSync(inputFile, 'utf8');
  const items = JSON.parse(data);
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Split items into chunks
  const totalChunks = Math.ceil(items.length / chunkSize);
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, items.length);
    const chunk = items.slice(start, end);
    
    // Create filename with zero-padded number
    const chunkNumber = String(i + 1).padStart(2, '0');
    const outputFile = path.join(outputDir, `chunk-${chunkNumber}.json`);
    
    // Write chunk to file
    fs.writeFileSync(outputFile, JSON.stringify(chunk, null, 2), 'utf8');
    
    console.log(`✓ Created ${outputFile} with ${chunk.length} items (${start + 1}-${end})`);
  }
  
  console.log(`\n✓ Successfully split ${items.length} items into ${totalChunks} files`);
  console.log(`✓ Files saved in: ${outputDir}`);
  
} catch (error) {
  console.error('Error processing file:', error.message);
  process.exit(1);
}