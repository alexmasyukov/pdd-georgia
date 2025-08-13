import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  // Read the source file (output.ru.json)
  const sourceFilePath = path.join(__dirname, 'output.ru.json');
  const sourceContent = fs.readFileSync(sourceFilePath, 'utf8');
  
  // Remove any BOM and parse
  const cleanedContent = sourceContent.replace(/^\uFEFF/, '');
  const sourceData = JSON.parse(cleanedContent);
  
  // Read the target file (public/ru.json)
  const targetFilePath = path.join(__dirname, 'public', 'ru.json');
  const targetData = JSON.parse(fs.readFileSync(targetFilePath, 'utf8'));
  
  // Create a map of id to question_explained from source data
  const explainedMap = new Map();
  sourceData.forEach(item => {
    if (item.id && item.question_explained) {
      explainedMap.set(item.id, item.question_explained);
    }
  });
  
  // Update target data with question_explained values
  let updatedCount = 0;
  const updatedData = targetData.map(item => {
    if (explainedMap.has(item.id)) {
      const newExplanation = explainedMap.get(item.id);
      if (item.question_explained !== newExplanation) {
        updatedCount++;
        console.log(`Updating ID ${item.id}: "${item.question_explained}" -> "${newExplanation}"`);
        return {
          ...item,
          question_explained: newExplanation
        };
      }
    }
    return item;
  });
  
  // Write the updated data back to public/ru.json
  fs.writeFileSync(targetFilePath, JSON.stringify(updatedData, null, 2), 'utf8');
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully updated ${updatedCount} question explanations`);
  console.log(`📁 File saved to: ${targetFilePath}`);
  console.log(`📊 Total items in target file: ${targetData.length}`);
  console.log(`📊 Total items in source file: ${sourceData.length}`);
  console.log(`📊 Items with explanations in source: ${explainedMap.size}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}