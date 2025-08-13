import type { Categories, Category, CategoryStats } from '@/types';
import { API_ENDPOINTS } from '@utils/constants';
import LocalStorageService from '@services/LocalStorageService';
import QuestionService from '@services/QuestionService';

class CategoryService {
  private categories: Categories = {};
  private loading = false;
  private error: string | null = null;

  async loadCategories(): Promise<Categories> {
    if (Object.keys(this.categories).length > 0) {
      return this.categories;
    }

    if (this.loading) {
      // Wait for the current loading to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.loading) {
            clearInterval(checkInterval);
            resolve(this.categories);
          }
        }, 100);
      });
    }

    this.loading = true;
    this.error = null;

    try {
      const response = await fetch(API_ENDPOINTS.CATEGORIES);
      if (!response.ok) {
        throw new Error(`Failed to load categories: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.categories = data;
      return this.categories;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error loading categories:', error);
      return {};
    } finally {
      this.loading = false;
    }
  }

  async getCategories(): Promise<Categories> {
    if (Object.keys(this.categories).length === 0) {
      await this.loadCategories();
    }
    return this.categories;
  }

  async getCategoriesArray(): Promise<Category[]> {
    const categories = await this.getCategories();
    return Object.entries(categories).map(([id, name]) => ({
      id,
      name,
    }));
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const categories = await this.getCategories();
    const name = categories[id];
    
    if (!name) {
      return null;
    }
    
    return { id, name };
  }

  async getCategoryStats(categoryId: string): Promise<CategoryStats> {
    const counts = LocalStorageService.getCategoryListCounts(categoryId);
    const isCompleted = LocalStorageService.isCategoryCompleted(categoryId);
    const questions = await QuestionService.getQuestionsByCategory(categoryId);
    const totalCount = questions.length;
    
    return {
      ...counts,
      isCompleted,
      totalCount,
    };
  }

  async getAllCategoriesStats(): Promise<Record<string, CategoryStats>> {
    const categories = await this.getCategories();
    const stats: Record<string, CategoryStats> = {};
    
    for (const categoryId of Object.keys(categories)) {
      stats[categoryId] = await this.getCategoryStats(categoryId);
    }
    
    return stats;
  }

  toggleCategoryComplete(categoryId: string): boolean {
    return LocalStorageService.toggleCategoryComplete(categoryId);
  }

  async getCategoryProgress(categoryId: string): Promise<{
    total: number;
    answered: number;
    correct: number;
    percentage: number;
  }> {
    const questions = await QuestionService.getQuestionsByCategory(categoryId);
    const total = questions.length;
    
    // For now, we'll just return mock data
    // In a real app, we'd track answered questions and correct answers
    const answered = 0;
    const correct = 0;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    return {
      total,
      answered,
      correct,
      percentage,
    };
  }

  async searchCategories(query: string): Promise<Category[]> {
    const categories = await this.getCategoriesArray();
    const lowerQuery = query.toLowerCase();
    
    return categories.filter(category =>
      category.name.toLowerCase().includes(lowerQuery)
    );
  }

  getError(): string | null {
    return this.error;
  }

  isLoading(): boolean {
    return this.loading;
  }

  clearCache(): void {
    this.categories = {};
    this.error = null;
  }
}

export default new CategoryService();