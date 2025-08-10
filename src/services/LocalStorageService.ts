import type { Settings, ListType } from '@types';

class LocalStorageService {
  private readonly SETTINGS_KEY = 'settings';
  private readonly COMPLETE_KEY = 'complete';

  // Генераторы ключей для категорий
  getCategoryFavoriteKey(categoryId: number): string {
    return `${categoryId}-favorite`;
  }

  getCategoryKnownKey(categoryId: number): string {
    return `${categoryId}-known`;
  }

  getCategoryHardKey(categoryId: number): string {
    return `${categoryId}-hard`;
  }

  private getListKey(categoryId: number, listType: ListType): string {
    switch (listType) {
      case 'favorite':
        return this.getCategoryFavoriteKey(categoryId);
      case 'known':
        return this.getCategoryKnownKey(categoryId);
      case 'hard':
        return this.getCategoryHardKey(categoryId);
    }
  }

  // Работа с настройками
  getSettings(): Settings {
    const settings = localStorage.getItem(this.SETTINGS_KEY);
    if (settings) {
      return JSON.parse(settings);
    }
    return { perPage: 10 };
  }

  updateSettings(settings: Partial<Settings>): void {
    const currentSettings = this.getSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
  }

  getPerPage(): number {
    return this.getSettings().perPage;
  }

  setPerPage(value: number): void {
    this.updateSettings({ perPage: value });
  }

  // Работа с изученными категориями
  getCompletedCategories(): number[] {
    const completed = localStorage.getItem(this.COMPLETE_KEY);
    if (completed) {
      return JSON.parse(completed);
    }
    return [];
  }

  isCategoryCompleted(categoryId: number): boolean {
    const completed = this.getCompletedCategories();
    return completed.includes(categoryId);
  }

  toggleCategoryCompleted(categoryId: number): void {
    const completed = this.getCompletedCategories();
    const index = completed.indexOf(categoryId);
    
    if (index === -1) {
      completed.push(categoryId);
    } else {
      completed.splice(index, 1);
    }
    
    localStorage.setItem(this.COMPLETE_KEY, JSON.stringify(completed));
  }

  // Работа со списками вопросов
  private getQuestionIds(key: string): number[] {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  }

  private setQuestionIds(key: string, ids: number[]): void {
    localStorage.setItem(key, JSON.stringify(ids));
  }

  getFavoriteQuestionIds(categoryId: number): number[] {
    return this.getQuestionIds(this.getCategoryFavoriteKey(categoryId));
  }

  getKnownQuestionIds(categoryId: number): number[] {
    return this.getQuestionIds(this.getCategoryKnownKey(categoryId));
  }

  getHardQuestionIds(categoryId: number): number[] {
    return this.getQuestionIds(this.getCategoryHardKey(categoryId));
  }

  // Добавление/удаление из списков
  toggleQuestionInList(categoryId: number, questionId: number, listType: ListType): void {
    const key = this.getListKey(categoryId, listType);
    const ids = this.getQuestionIds(key);
    const index = ids.indexOf(questionId);
    
    if (index === -1) {
      ids.push(questionId);
    } else {
      ids.splice(index, 1);
    }
    
    this.setQuestionIds(key, ids);
  }

  isQuestionInList(categoryId: number, questionId: number, listType: ListType): boolean {
    const key = this.getListKey(categoryId, listType);
    const ids = this.getQuestionIds(key);
    return ids.includes(questionId);
  }

  // Получение всех вопросов из списка по всем категориям
  private getAllQuestionsByListType(listType: ListType): { categoryId: number; questionId: number }[] {
    const result: { categoryId: number; questionId: number }[] = [];
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      const match = key.match(/^(\d+)-(\w+)$/);
      if (match && match[2] === listType) {
        const categoryId = parseInt(match[1], 10);
        const questionIds = this.getQuestionIds(key);
        questionIds.forEach(questionId => {
          result.push({ categoryId, questionId });
        });
      }
    });
    
    return result;
  }

  getAllFavoriteQuestionIds(): { categoryId: number; questionId: number }[] {
    return this.getAllQuestionsByListType('favorite');
  }

  getAllKnownQuestionIds(): { categoryId: number; questionId: number }[] {
    return this.getAllQuestionsByListType('known');
  }

  getAllHardQuestionIds(): { categoryId: number; questionId: number }[] {
    return this.getAllQuestionsByListType('hard');
  }

  // Очистка всех данных (для отладки)
  clearAll(): void {
    localStorage.clear();
  }
}

export default new LocalStorageService();