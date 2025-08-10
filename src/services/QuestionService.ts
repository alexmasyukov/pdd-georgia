import type { Question } from '@types';
import questionsData from '@data/ru.json';
import LocalStorageService from './LocalStorageService';

class QuestionService {
  private questions: Question[] = questionsData as Question[];

  // Получение вопросов
  getAllQuestions(): Question[] {
    return this.questions;
  }

  getQuestionsByCategory(categoryId: number): Question[] {
    return this.questions.filter(q => q.category === categoryId);
  }

  getQuestionById(id: number): Question | undefined {
    return this.questions.find(q => q.id === id);
  }

  // Фильтрация вопросов по спискам
  getQuestionsByIds(ids: number[]): Question[] {
    return this.questions.filter(q => ids.includes(q.id));
  }

  getFavoriteQuestions(categoryId?: number): Question[] {
    if (categoryId !== undefined) {
      const ids = LocalStorageService.getFavoriteQuestionIds(categoryId);
      return this.getQuestionsByIds(ids);
    }
    
    const allFavorites = LocalStorageService.getAllFavoriteQuestionIds();
    const questionIds = allFavorites.map(item => item.questionId);
    return this.getQuestionsByIds(questionIds);
  }

  getKnownQuestions(categoryId?: number): Question[] {
    if (categoryId !== undefined) {
      const ids = LocalStorageService.getKnownQuestionIds(categoryId);
      return this.getQuestionsByIds(ids);
    }
    
    const allKnown = LocalStorageService.getAllKnownQuestionIds();
    const questionIds = allKnown.map(item => item.questionId);
    return this.getQuestionsByIds(questionIds);
  }

  getHardQuestions(categoryId?: number): Question[] {
    if (categoryId !== undefined) {
      const ids = LocalStorageService.getHardQuestionIds(categoryId);
      return this.getQuestionsByIds(ids);
    }
    
    const allHard = LocalStorageService.getAllHardQuestionIds();
    const questionIds = allHard.map(item => item.questionId);
    return this.getQuestionsByIds(questionIds);
  }

  // Подсчет вопросов
  getQuestionCountByCategory(categoryId: number): number {
    return this.getQuestionsByCategory(categoryId).length;
  }

  getFavoriteCountByCategory(categoryId: number): number {
    return LocalStorageService.getFavoriteQuestionIds(categoryId).length;
  }

  getKnownCountByCategory(categoryId: number): number {
    return LocalStorageService.getKnownQuestionIds(categoryId).length;
  }

  getHardCountByCategory(categoryId: number): number {
    return LocalStorageService.getHardQuestionIds(categoryId).length;
  }

  // Проверка ответа
  checkAnswer(questionId: number, answer: string): boolean {
    const question = this.getQuestionById(questionId);
    if (!question) return false;
    return question.correct_answer === answer;
  }

  getCorrectAnswer(questionId: number): string {
    const question = this.getQuestionById(questionId);
    return question?.correct_answer || '';
  }

  // Получение изображения вопроса
  getQuestionImage(question: Question): string | null {
    if (question.hasImg === 1 && question.img) {
      // Преобразуем путь из ticket_media/new/ticketIMG-1215.jpg в /images/ticketIMG-1215.jpg
      const imageName = question.img.split('/').pop();
      return `/images/${imageName}`;
    }
    return null;
  }

  // Получение ответов в виде массива
  getAnswers(question: Question): Array<{ id: string; text: string }> {
    const answers: Array<{ id: string; text: string }> = [];
    
    if (question.answer_1) {
      answers.push({ id: '1', text: question.answer_1 });
    }
    if (question.answer_2) {
      answers.push({ id: '2', text: question.answer_2 });
    }
    if (question.answer_3) {
      answers.push({ id: '3', text: question.answer_3 });
    }
    if (question.answer_4) {
      answers.push({ id: '4', text: question.answer_4 });
    }
    
    return answers;
  }
}

export default new QuestionService();