import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем __dirname для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Получаем category id из аргументов командной строки
const categoryId = parseInt(process.argv[2]);

if (!categoryId) {
  console.error('Использование: node filterByCategory.js <category_id>');
  console.error('Пример: node filterByCategory.js 32');
  process.exit(1);
}

try {
  // Читаем исходный файл
  const inputPath = path.join(__dirname, 'public', 'ru.json');
  const outputPath = path.join(__dirname, 'filtered.json');
  
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const questions = JSON.parse(rawData);
  
  // Фильтруем по category
  const filteredQuestions = questions.filter(question => question.category === categoryId);
  
  // Сохраняем отфильтрованные данные
  fs.writeFileSync(outputPath, JSON.stringify(filteredQuestions, null, 2), 'utf8');
  
  console.log(`✅ Фильтрация завершена!`);
  console.log(`📊 Всего вопросов: ${questions.length}`);
  console.log(`🎯 Отфильтровано для категории ${categoryId}: ${filteredQuestions.length} вопросов`);
  console.log(`💾 Результат сохранен в: ${outputPath}`);
  
} catch (error) {
  console.error('❌ Ошибка при обработке файла:', error.message);
  process.exit(1);
}