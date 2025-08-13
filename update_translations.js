import fs from 'fs';

const original = 'public/ru.json'

// Читаем файлы
const translatedData = JSON.parse(fs.readFileSync('filtered_translated.json', 'utf8'));
const originalData = JSON.parse(fs.readFileSync(original, 'utf8'));

// Создаем словарь переводов по id
const translationsMap = {};
translatedData.forEach(item => {
    translationsMap[item.id] = item.question_explained;
});

// Обновляем оригинальные данные
const updatedData = originalData.map(item => {
    if (translationsMap[item.id]) {
        return {
            ...item,
            question_explained: translationsMap[item.id]
        };
    }
    return item;
});

// Сохраняем обновленный файл
fs.writeFileSync(original, JSON.stringify(updatedData, null, 2), 'utf8');

console.log('✅ Успешно обновлено записей:', Object.keys(translationsMap).length);