export interface Question {
  id: number;
  question: string;
  answer_1?: string;
  answer_2?: string;
  answer_3?: string;
  answer_4?: string;
  correct_answer: string;
  hasImg: 0 | 1;
  img?: string;
  question_explained: string;
  audio?: string | null;
  category: number;
}

export interface Category {
  id: string;
  name: string;
}

export type Categories = Record<string, string>;

export interface Settings {
  perPage: number;
}

export type QuestionList = 'favorite' | 'known' | 'hard';

export interface CategoryStats {
  favoriteCount: number;
  knownCount: number;
  hardCount: number;
  isCompleted: boolean;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface AnswerState {
  questionId: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

export interface LocalStorageData {
  settings: Settings;
  complete: string[];
  [key: string]: any;
}