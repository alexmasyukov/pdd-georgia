import type {Category, CategoryStats} from '@types';
import categoriesData from '@data/categories.json';
import LocalStorageService from './LocalStorageService';
import QuestionService from './QuestionService';

class CategoryService {
  private categories: Category[] = [];

  constructor() {
    // Преобразуем объект категорий в массив
    this.categories = Object.entries(categoriesData).map(([id, name]) => ({
      id: parseInt(id, 10),
      name
    }));
  }

  getAllCategories(): Category[] {
    return this.categories;
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  getCategoryName(id: number): string {
    const category = this.getCategoryById(id);
    return category?.name || 'Неизвестная категория';
  }

  // Статистика по категории
  getCategoryStats(categoryId: number): CategoryStats {
    const total = QuestionService.getQuestionCountByCategory(categoryId);
    const favorites = QuestionService.getFavoriteCountByCategory(categoryId);
    const known = QuestionService.getKnownCountByCategory(categoryId);
    const hard = QuestionService.getHardCountByCategory(categoryId);
    const isCompleted = LocalStorageService.isCategoryCompleted(categoryId);

    return {
      total,
      favorites,
      known,
      hard,
      isCompleted
    };
  }

  // Получение всех статистик для отображения в списке категорий
  getAllCategoryStats(): Map<number, CategoryStats> {
    const statsMap = new Map<number, CategoryStats>();

    this.categories.forEach(category => {
      statsMap.set(category.id, this.getCategoryStats(category.id));
    });

    return statsMap;
  }

  // Проверка, есть ли вопросы в категории
  hasQuestions(categoryId: number): boolean {
    return QuestionService.getQuestionCountByCategory(categoryId) > 0;
  }
}

export default new CategoryService();