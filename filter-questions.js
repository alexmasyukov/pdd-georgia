import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем __dirname для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем исходный файл
const inputFile = path.join(__dirname, 'src', 'data', 'ru.json');
const outputFile = path.join(__dirname, 'src', 'data', 'ru-filtered.json');

try {
    // Читаем и парсим JSON файл
    const data = fs.readFileSync(inputFile, 'utf8');
    const questions = JSON.parse(data);
    
    console.log(`Исходное количество вопросов: ${questions.length}`);
    
    // Фильтруем вопросы, оставляя только те, где в categories есть 1
    const filteredQuestions = questions.filter(question => {
        return question.categories && question.categories.includes(1);
    });
    
    // Переименовываем поле subject в category и удаляем поле categories
    const processedQuestions = filteredQuestions.map(question => {
        const { subject, categories, ...rest } = question;
        return {
            ...rest,
            category: subject
        };
    });
    
    console.log(`Отфильтровано вопросов (категория 1): ${processedQuestions.length}`);
    console.log(`Удалено вопросов: ${questions.length - processedQuestions.length}`);
    
    // Записываем результат в новый файл
    fs.writeFileSync(outputFile, JSON.stringify(processedQuestions, null, 4), 'utf8');
    
    console.log(`\nРезультат сохранен в файл: ${outputFile}`);
    
    // Показываем пример первого обработанного вопроса
    if (processedQuestions.length > 0) {
        console.log('\nПример обработанного вопроса:');
        console.log(JSON.stringify(processedQuestions[0], null, 2).substring(0, 500) + '...');
    }
    
} catch (error) {
    console.error('Ошибка при обработке файла:', error.message);
    process.exit(1);
}