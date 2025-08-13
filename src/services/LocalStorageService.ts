import type { Settings, QuestionList } from '@/types';
import { LOCAL_STORAGE_KEYS, DEFAULT_SETTINGS } from '@utils/constants';
import { getCategoryKey } from '@utils/helpers';

class LocalStorageService {
  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  // Settings
  getSettings(): Settings {
    const settings = this.getItem<Settings>(LOCAL_STORAGE_KEYS.SETTINGS);
    return settings || DEFAULT_SETTINGS;
  }

  setSettings(settings: Settings): void {
    this.setItem(LOCAL_STORAGE_KEYS.SETTINGS, settings);
  }

  updateSettings(partialSettings: Partial<Settings>): void {
    const currentSettings = this.getSettings();
    this.setSettings({ ...currentSettings, ...partialSettings });
  }

  // Completed categories
  getCompletedCategories(): string[] {
    return this.getItem<string[]>(LOCAL_STORAGE_KEYS.COMPLETE) || [];
  }

  setCompletedCategories(categories: string[]): void {
    this.setItem(LOCAL_STORAGE_KEYS.COMPLETE, categories);
  }

  toggleCategoryComplete(categoryId: string): boolean {
    const completed = this.getCompletedCategories();
    const index = completed.indexOf(categoryId);
    
    if (index === -1) {
      completed.push(categoryId);
    } else {
      completed.splice(index, 1);
    }
    
    this.setCompletedCategories(completed);
    return index === -1;
  }

  isCategoryCompleted(categoryId: string): boolean {
    const completed = this.getCompletedCategories();
    return completed.includes(categoryId);
  }

  // Show detailed hint setting
  getShowDetailedHint(): boolean {
    return this.getItem<boolean>(LOCAL_STORAGE_KEYS.SHOW_DETAILED_HINT) || false;
  }

  setShowDetailedHint(value: boolean): void {
    this.setItem(LOCAL_STORAGE_KEYS.SHOW_DETAILED_HINT, value);
  }

  // Question lists (favorite, known, hard)
  getQuestionIdsByCategory(categoryId: string, listType: QuestionList): number[] {
    const key = getCategoryKey(categoryId, listType);
    return this.getItem<number[]>(key) || [];
  }

  setQuestionIdsByCategory(categoryId: string, listType: QuestionList, ids: number[]): void {
    const key = getCategoryKey(categoryId, listType);
    if (ids.length === 0) {
      this.removeItem(key);
    } else {
      this.setItem(key, ids);
    }
  }

  addQuestionToList(categoryId: string, listType: QuestionList, questionId: number): void {
    const ids = this.getQuestionIdsByCategory(categoryId, listType);
    if (!ids.includes(questionId)) {
      ids.push(questionId);
      this.setQuestionIdsByCategory(categoryId, listType, ids);
    }
  }

  removeQuestionFromList(categoryId: string, listType: QuestionList, questionId: number): void {
    const ids = this.getQuestionIdsByCategory(categoryId, listType);
    const index = ids.indexOf(questionId);
    if (index !== -1) {
      ids.splice(index, 1);
      this.setQuestionIdsByCategory(categoryId, listType, ids);
    }
  }

  toggleQuestionInList(categoryId: string, listType: QuestionList, questionId: number): boolean {
    const ids = this.getQuestionIdsByCategory(categoryId, listType);
    const index = ids.indexOf(questionId);
    
    if (index === -1) {
      this.addQuestionToList(categoryId, listType, questionId);
      return true;
    } else {
      this.removeQuestionFromList(categoryId, listType, questionId);
      return false;
    }
  }

  isQuestionInList(categoryId: string, listType: QuestionList, questionId: number): boolean {
    const ids = this.getQuestionIdsByCategory(categoryId, listType);
    return ids.includes(questionId);
  }

  // Get all question IDs from all categories for a specific list type
  getAllQuestionIdsByListType(listType: QuestionList): number[] {
    const allIds: number[] = [];
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.endsWith(`-${listType}`)) {
        const ids = this.getItem<number[]>(key);
        if (ids) {
          allIds.push(...ids);
        }
      }
    });
    
    return [...new Set(allIds)]; // Remove duplicates
  }

  // Get counts for a category
  getCategoryListCounts(categoryId: string): {
    favoriteCount: number;
    knownCount: number;
    hardCount: number;
  } {
    return {
      favoriteCount: this.getQuestionIdsByCategory(categoryId, 'favorite').length,
      knownCount: this.getQuestionIdsByCategory(categoryId, 'known').length,
      hardCount: this.getQuestionIdsByCategory(categoryId, 'hard').length,
    };
  }

  // Clear all data
  clearAll(): void {
    localStorage.clear();
  }

  // Export all data
  exportData(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      const value = this.getItem(key);
      if (value !== null) {
        data[key] = value;
      }
    });
    
    return data;
  }

  // Import data
  importData(data: Record<string, unknown>): void {
    this.clearAll();
    
    Object.entries(data).forEach(([key, value]) => {
      this.setItem(key, value);
    });
  }
}

export default new LocalStorageService();