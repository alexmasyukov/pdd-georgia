#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_FILE = 'filtered_translated_with_actions_and_reasons.json';
const TARGET_FILE = process.argv[2];

// Check if target file is provided
if (!TARGET_FILE) {
  console.error('Usage: node merge_question_detailed.js <target_file.json>');
  console.error('Example: node merge_question_detailed.js output.json');
  process.exit(1);
}

// Function to read JSON file
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    process.exit(1);
  }
}

// Function to write JSON file
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Successfully wrote to ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error.message);
    process.exit(1);
  }
}

// Main function
function mergeQuestionDetailedField() {
  console.log(`📖 Reading source file: ${SOURCE_FILE}`);
  const sourceData = readJsonFile(SOURCE_FILE);
  
  console.log(`📖 Reading target file: ${TARGET_FILE}`);
  const targetData = readJsonFile(TARGET_FILE);
  
  // Create a map of source data by id for quick lookup
  const sourceMap = new Map();
  sourceData.forEach(item => {
    if (item.id && item.question_explained_detailed) {
      sourceMap.set(item.id, item.question_explained_detailed);
    }
  });
  
  console.log(`🔍 Found ${sourceMap.size} items with question_explained_detailed in source file`);
  
  // Update target data
  let updatedCount = 0;
  let addedCount = 0;
  
  targetData.forEach(item => {
    if (sourceMap.has(item.id)) {
      if (!item.question_explained_detailed) {
        addedCount++;
      } else if (item.question_explained_detailed !== sourceMap.get(item.id)) {
        updatedCount++;
      }
      item.question_explained_detailed = sourceMap.get(item.id);
    }
  });
  
  console.log(`✨ Added question_explained_detailed to ${addedCount} items`);
  console.log(`🔄 Updated question_explained_detailed in ${updatedCount} items`);
  
  // Create backup of target file
  const backupFile = `${TARGET_FILE}.backup.${Date.now()}.json`;
  console.log(`💾 Creating backup: ${backupFile}`);
  writeJsonFile(backupFile, readJsonFile(TARGET_FILE));
  
  // Write updated data to target file
  console.log(`📝 Writing updated data to ${TARGET_FILE}`);
  writeJsonFile(TARGET_FILE, targetData);
  
  // Summary
  console.log('\n📊 Summary:');
  console.log(`   - Source items processed: ${sourceData.length}`);
  console.log(`   - Target items processed: ${targetData.length}`);
  console.log(`   - Fields added: ${addedCount}`);
  console.log(`   - Fields updated: ${updatedCount}`);
  console.log(`   - Total modified: ${addedCount + updatedCount}`);
  console.log(`   - Backup created: ${backupFile}`);
}

// Run the script
console.log('🚀 Starting merge process...\n');
mergeQuestionDetailedField();
console.log('\n✅ Process completed successfully!');