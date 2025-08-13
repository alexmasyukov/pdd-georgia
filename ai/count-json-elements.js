import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get arguments from command line
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node count-json-elements.js <directory> <extension> <characters>');
  console.error('Example: node count-json-elements.js ./src .js "const let var"');
  process.exit(1);
}

const directory = path.resolve(args[0]);
const extension = args[1].startsWith('.') ? args[1] : `.${args[1]}`;
const searchChars = args[2];

// Function to count occurrences of characters in text
function countOccurrences(text, chars) {
  let count = 0;
  let index = 0;
  while ((index = text.indexOf(chars, index)) !== -1) {
    count++;
    index += chars.length;
  }
  return count;
}

// Function to recursively find files with given extension
function findFiles(dir, ext, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, ext, fileList);
    } else if (path.extname(file) === ext) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

try {
  // Check if directory exists
  if (!fs.existsSync(directory)) {
    console.error(`Directory not found: ${directory}`);
    process.exit(1);
  }

  // Find all files with the specified extension
  const files = findFiles(directory, extension);
  
  if (files.length === 0) {
    console.log(`No files with extension ${extension} found in ${directory}`);
    process.exit(0);
  }

  let totalCount = 0;
  const results = [];

  // Process each file
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const count = countOccurrences(content, searchChars);
    totalCount += count;
    
    // Store result with relative path for cleaner output
    const relativePath = path.relative(directory, file);
    results.push({ file: relativePath, count });
  });

  // Sort results by count (descending)
  results.sort((a, b) => b.count - a.count);

  // Display results
  console.log(`\nSearching for "${searchChars}" in ${extension} files:\n`);
  console.log('File - Count');
  console.log('-'.repeat(50));
  
  results.forEach(result => {
    if (result.count > 0) {
      console.log(`${result.file} - ${result.count}`);
    }
  });

  // Display files with 0 occurrences separately
  const zeroCount = results.filter(r => r.count === 0);
  if (zeroCount.length > 0) {
    console.log('\nFiles with 0 occurrences:');
    zeroCount.forEach(result => {
      console.log(`${result.file} - 0`);
    });
  }

  console.log('-'.repeat(50));
  console.log(`\nTotal files processed: ${files.length}`);
  console.log(`Files with occurrences: ${results.filter(r => r.count > 0).length}`);
  console.log(`\nall - ${totalCount}`);

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}