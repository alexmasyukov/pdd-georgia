import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'src', 'data', 'ru.json');
const data = fs.readFileSync(inputFile, 'utf8');
const questions = JSON.parse(data);

console.log('Общее количество вопросов:', questions.length);

const withCat1 = questions.filter(q => q.categories && q.categories.includes(1));
const withoutCat1 = questions.filter(q => !q.categories || !q.categories.includes(1));

console.log('Вопросы С категорией 1:', withCat1.length);
console.log('Вопросы БЕЗ категории 1:', withoutCat1.length);

if (withoutCat1.length > 0) {
    console.log('\nПример вопроса БЕЗ категории 1:');
    console.log(JSON.stringify(withoutCat1[0], null, 2));
}

// Анализ всех категорий
const categoryStats = {};
questions.forEach(q => {
    if (q.categories) {
        q.categories.forEach(cat => {
            categoryStats[cat] = (categoryStats[cat] || 0) + 1;
        });
    }
});

console.log('\nСтатистика по категориям:');
Object.keys(categoryStats).sort((a, b) => a - b).forEach(cat => {
    console.log(`Категория ${cat}: ${categoryStats[cat]} вопросов`);
});