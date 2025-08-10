import type { Question, QuestionList } from '@/types';
import { API_ENDPOINTS } from '@utils/constants';
import { filterQuestionsByIds } from '@utils/helpers';
import LocalStorageService from '@services/LocalStorageService';

class QuestionService {
  private questions: Question[] = [];
  private loading = false;
  private error: string | null = null;

  async loadQuestions(): Promise<Question[]> {
    if (this.questions.length > 0) {
      return this.questions;
    }

    if (this.loading) {
      // Wait for the current loading to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.loading) {
            clearInterval(checkInterval);
            resolve(this.questions);
          }
        }, 100);
      });
    }

    this.loading = true;
    this.error = null;

    try {
      const response = await fetch(API_ENDPOINTS.QUESTIONS);
      if (!response.ok) {
        throw new Error(`Failed to load questions: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.questions = data;
      return this.questions;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error loading questions:', error);
      return [];
    } finally {
      this.loading = false;
    }
  }

  async getQuestions(): Promise<Question[]> {
    if (this.questions.length === 0) {
      await this.loadQuestions();
    }
    return this.questions;
  }

  async getQuestionById(id: number): Promise<Question | undefined> {
    const questions = await this.getQuestions();
    return questions.find(q => q.id === id);
  }

  async getQuestionsByCategory(categoryId: string): Promise<Question[]> {
    const questions = await this.getQuestions();
    return questions.filter(q => q.category === parseInt(categoryId, 10));
  }

  async getQuestionsByCategoryAndList(
    categoryId: string,
    listType: QuestionList
  ): Promise<Question[]> {
    const categoryQuestions = await this.getQuestionsByCategory(categoryId);
    const questionIds = LocalStorageService.getQuestionIdsByCategory(categoryId, listType);
    return filterQuestionsByIds(categoryQuestions, questionIds);
  }

  async getAllQuestionsByList(listType: QuestionList): Promise<Question[]> {
    const questions = await this.getQuestions();
    const questionIds = LocalStorageService.getAllQuestionIdsByListType(listType);
    return filterQuestionsByIds(questions, questionIds);
  }

  async searchQuestions(query: string): Promise<Question[]> {
    const questions = await this.getQuestions();
    const lowerQuery = query.toLowerCase();
    
    return questions.filter(q => 
      q.question.toLowerCase().includes(lowerQuery) ||
      q.answer_1?.toLowerCase().includes(lowerQuery) ||
      q.answer_2?.toLowerCase().includes(lowerQuery) ||
      q.answer_3?.toLowerCase().includes(lowerQuery) ||
      q.answer_4?.toLowerCase().includes(lowerQuery)
    );
  }

  getQuestionStats(question: Question): {
    isFavorite: boolean;
    isKnown: boolean;
    isHard: boolean;
  } {
    const categoryId = question.category.toString();
    
    return {
      isFavorite: LocalStorageService.isQuestionInList(categoryId, 'favorite', question.id),
      isKnown: LocalStorageService.isQuestionInList(categoryId, 'known', question.id),
      isHard: LocalStorageService.isQuestionInList(categoryId, 'hard', question.id),
    };
  }

  toggleQuestionInList(question: Question, listType: QuestionList): boolean {
    const categoryId = question.category.toString();
    return LocalStorageService.toggleQuestionInList(categoryId, listType, question.id);
  }

  checkAnswer(question: Question, selectedAnswer: string): boolean {
    return question.correct_answer === selectedAnswer;
  }

  getAnswers(question: Question): Array<{ number: string; text: string | undefined }> {
    const answers: Array<{ number: string; text: string | undefined }> = [];
    
    if (question.answer_1) {
      answers.push({ number: '1', text: question.answer_1 });
    }
    if (question.answer_2) {
      answers.push({ number: '2', text: question.answer_2 });
    }
    if (question.answer_3) {
      answers.push({ number: '3', text: question.answer_3 });
    }
    if (question.answer_4) {
      answers.push({ number: '4', text: question.answer_4 });
    }
    
    return answers;
  }

  getError(): string | null {
    return this.error;
  }

  isLoading(): boolean {
    return this.loading;
  }

  clearCache(): void {
    this.questions = [];
    this.error = null;
  }
}

export default new QuestionService();