# План реализации приложения для тестирования ПДД Грузии

## 1. Установка необходимых пакетов

```bash
yarn add sass react-router-dom @mui/material @emotion/react @emotion/styled lucide-react
yarn add -D @types/node
```

## 2. Структура данных

### Анализ полей вопроса (ru.json):
- `id`: number - уникальный идентификатор вопроса
- `question`: string - текст вопроса
- `answer_1`: string - первый вариант ответа (обязательный)
- `answer_2`: string - второй вариант ответа (опциональный)
- `answer_3`: string - третий вариант ответа (опциональный)
- `answer_4`: string - четвертый вариант ответа (опциональный)
- `correct_answer`: string - номер правильного ответа ("1", "2", "3", "4")
- `question_explained`: string - объяснение/подсказка к вопросу
- `hasImg`: 0 | 1 - флаг наличия изображения
- `img`: string - путь к изображению (если hasImg === 1)
- `category`: number - ID категории, к которой относится вопрос
- `audio`: null - не используется

### Категории (categories.json):
- Объект где ключ - ID категории (string), значение - название категории
- Работаем только с categoryId = 1 ("Водитель, пассажир и пешеход, знаки, условности")

### TypeScript типы:
```typescript
interface Question {
  id: number;
  question: string;
  answer_1: string;
  answer_2?: string;
  answer_3?: string;
  answer_4?: string;
  correct_answer: string;
  question_explained: string;
  hasImg: 0 | 1;
  img?: string;
  category: number;
  audio: null;
}

interface Category {
  id: number;
  name: string;
}

interface Settings {
  perPage: number; // 10, 20 или 30
}

type ListType = 'favorite' | 'known' | 'hard';

interface CategoryStats {
  total: number;
  favorites: number;
  known: number;
  hard: number;
  isCompleted: boolean;
}
```

## 3. Архитектура проекта

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.tsx          # Основной макет с двумя колонками
│   │   └── Layout.scss
│   ├── Header/
│   │   ├── Header.tsx          # Верхняя панель управления
│   │   └── Header.scss
│   ├── CategoryList/
│   │   ├── CategoryList.tsx    # Список категорий
│   │   ├── CategoryItem.tsx    # Элемент категории с счетчиками
│   │   └── CategoryList.scss
│   ├── QuestionList/
│   │   ├── QuestionList.tsx    # Список вопросов с пагинацией
│   │   └── QuestionList.scss
│   ├── QuestionCard/
│   │   ├── QuestionCard.tsx    # Карточка вопроса
│   │   ├── AnswerOption.tsx    # Вариант ответа
│   │   └── QuestionCard.scss
│   ├── Pagination/
│   │   ├── Pagination.tsx      # Компонент пагинации
│   │   └── Pagination.scss
│   └── Navigation/
│       ├── Navigation.tsx      # Навигация по спискам
│       └── Navigation.scss
│
├── pages/
│   ├── HomePage/
│   │   ├── HomePage.tsx        # Главная страница
│   │   └── HomePage.scss
│   ├── CategoryPage/
│   │   ├── CategoryPage.tsx    # Страница категории
│   │   └── CategoryPage.scss
│   ├── FavoritesPage/
│   │   ├── FavoritesPage.tsx   # Все избранные
│   │   └── FavoritesPage.scss
│   ├── KnownPage/
│   │   ├── KnownPage.tsx       # Все "точно знаю"
│   │   └── KnownPage.scss
│   └── HardPage/
│       ├── HardPage.tsx        # Все "плохо запоминаются"
│       └── HardPage.scss
│
├── services/
│   ├── LocalStorageService.ts  # Работа с LocalStorage
│   ├── QuestionService.ts      # Работа с вопросами
│   ├── CategoryService.ts      # Работа с категориями
│   └── PaginationService.ts    # Вспомогательный сервис пагинации
│
├── hooks/
│   ├── useLocalStorage.ts      # Hook для LocalStorage
│   ├── useQuestions.ts         # Hook для работы с вопросами
│   └── usePagination.ts        # Hook для пагинации
│
├── types/
│   └── index.ts                # Все TypeScript типы
│
├── utils/
│   ├── constants.ts            # Константы приложения
│   └── helpers.ts              # Вспомогательные функции
│
├── styles/
│   ├── index.scss              # Главный файл стилей
│   ├── variables.scss          # SCSS переменные
│   └── mixins.scss             # SCSS миксины
│
├── router/
│   └── index.tsx               # Настройка маршрутизации
│
└── App.tsx                     # Главный компонент приложения
```

## 4. Детальное описание сервисов

### LocalStorageService
```typescript
class LocalStorageService {
  // Ключи для хранения
  private readonly SETTINGS_KEY = 'settings';
  private readonly COMPLETE_KEY = 'complete';
  
  // Генераторы ключей для категорий
  getCategoryFavoriteKey(categoryId: number): string;
  getCategoryKnownKey(categoryId: number): string;
  getCategoryHardKey(categoryId: number): string;
  
  // Работа с настройками
  getSettings(): Settings;
  updateSettings(settings: Partial<Settings>): void;
  getPerPage(): number;
  setPerPage(value: number): void;
  
  // Работа с изученными категориями
  getCompletedCategories(): number[];
  isCategoryCompleted(categoryId: number): boolean;
  toggleCategoryCompleted(categoryId: number): void;
  
  // Работа со списками вопросов
  getFavoriteQuestionIds(categoryId: number): number[];
  getKnownQuestionIds(categoryId: number): number[];
  getHardQuestionIds(categoryId: number): number[];
  
  // Добавление/удаление из списков
  toggleQuestionInList(categoryId: number, questionId: number, listType: ListType): void;
  isQuestionInList(categoryId: number, questionId: number, listType: ListType): boolean;
  
  // Получение всех вопросов из списка по всем категориям
  getAllFavoriteQuestionIds(): { categoryId: number; questionId: number }[];
  getAllKnownQuestionIds(): { categoryId: number; questionId: number }[];
  getAllHardQuestionIds(): { categoryId: number; questionId: number }[];
}
```

### QuestionService
```typescript
class QuestionService {
  // Получение вопросов
  getAllQuestions(): Question[];
  getQuestionsByCategory(categoryId: number): Question[];
  getQuestionById(id: number): Question | undefined;
  
  // Фильтрация вопросов по спискам
  getQuestionsByIds(ids: number[]): Question[];
  getFavoriteQuestions(categoryId?: number): Question[];
  getKnownQuestions(categoryId?: number): Question[];
  getHardQuestions(categoryId?: number): Question[];
  
  // Подсчет вопросов
  getQuestionCountByCategory(categoryId: number): number;
  getFavoriteCountByCategory(categoryId: number): number;
  getKnownCountByCategory(categoryId: number): number;
  getHardCountByCategory(categoryId: number): number;
  
  // Проверка ответа
  checkAnswer(questionId: number, answer: string): boolean;
  getCorrectAnswer(questionId: number): string;
}
```

### CategoryService
```typescript
class CategoryService {
  getAllCategories(): Category[];
  getCategoryById(id: number): Category | undefined;
  getCategoryName(id: number): string;
  
  // Статистика по категории
  getCategoryStats(categoryId: number): CategoryStats;
}
```

### PaginationService
```typescript
class PaginationService {
  static paginate<T>(items: T[], page: number, perPage: number): {
    items: T[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## 5. Компоненты

### Layout
- Две колонки: категории слева (фиксированная ширина ~300px), контент справа
- Верхняя панель управления на всю ширину
- Адаптивность для мобильных устройств

### CategoryList
- Список всех категорий
- Цветовая индикация: серый фон - не изучено, зеленый - изучено
- Под названием категории ссылки с иконками и счетчиками:
  - ⭐ (N) - избранные → `/category/:id/favorites`
  - ✓ (N) - точно знаю → `/category/:id/known`
  - 🔥 (N) - плохо запоминаются → `/category/:id/hard`
- Клик по категории → `/category/:id`

### QuestionCard
- Номер вопроса в левом верхнем углу (мелкий)
- Иконка подсказки в правом верхнем углу → поповер с объяснением
- Изображение вопроса (или заглушка если null)
- Текст вопроса
- Варианты ответов (1-4, пустые слоты если меньше 4)
- Подсветка при выборе: зеленый - правильный, красный - неправильный
- Панель кнопок внизу справа:
  - "Добавить в избранное" / "Удалить из избранного"
  - "Точно знаю ответ" / "Удалить из точно знаю"
  - "Плохо запоминается" / "Удалить из плохо запоминающихся"

### Pagination
- Селект "вопросов на странице": 10 / 20 / 30 (слева внизу)
- Кнопки навигации по страницам
- Значение сохраняется в LocalStorage

## 6. Маршруты

```typescript
const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/category/:id', element: <CategoryPage /> },
  { path: '/favorites', element: <FavoritesPage /> },
  { path: '/known', element: <KnownPage /> },
  { path: '/hard', element: <HardPage /> },
  { path: '/category/:id/favorites', element: <CategoryPage filter="favorite" /> },
  { path: '/category/:id/known', element: <CategoryPage filter="known" /> },
  { path: '/category/:id/hard', element: <CategoryPage filter="hard" /> },
];
```

## 7. LocalStorage структура

```javascript
{
  "settings": { 
    "perPage": 10  // 10, 20 или 30
  },
  "complete": [1, 2, 3],  // ID изученных категорий
  "1-favorite": [123, 456, 789],  // ID избранных вопросов категории 1
  "1-known": [123, 555],  // ID вопросов "точно знаю" категории 1
  "1-hard": [222, 333],  // ID вопросов "плохо запоминаются" категории 1
  "2-favorite": [1001, 1002],  // и так далее для других категорий...
}
```

## 8. Порядок реализации

1. **Установка пакетов и настройка**
   - Установить все необходимые зависимости
   - Настроить SCSS
   - Настроить абсолютные импорты через @

2. **Базовая инфраструктура**
   - Создать TypeScript типы
   - Настроить React Router
   - Создать базовые стили и переменные

3. **Сервисы**
   - LocalStorageService
   - QuestionService
   - CategoryService
   - PaginationService

4. **Базовые компоненты**
   - Layout
   - Header

5. **Функциональные компоненты**
   - CategoryList и CategoryItem
   - QuestionCard и AnswerOption
   - QuestionList
   - Pagination

6. **Страницы**
   - HomePage
   - CategoryPage
   - FavoritesPage
   - KnownPage
   - HardPage

7. **Финальная доработка**
   - Навигация
   - Стилизация с MUI
   - Адаптивность

## 9. Важные моменты

- Работаем только в папке `src`
- Используем только категорию с ID = 1 для отображения вопросов
- Все состояния хранятся в LocalStorage
- Иконки берем из lucide-react
- UI компоненты из MUI
- Стили пишем на SCSS
- Строгая типизация через TypeScript
- Чистая архитектура без тестов