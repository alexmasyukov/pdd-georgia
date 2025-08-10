export interface Question {
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

export interface Category {
  id: number;
  name: string;
}

export interface Settings {
  perPage: number;
}

export type ListType = 'favorite' | 'known' | 'hard';

export interface CategoryStats {
  total: number;
  favorites: number;
  known: number;
  hard: number;
  isCompleted: boolean;
}

export interface PaginationResult<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QuestionWithMeta extends Question {
  isFavorite?: boolean;
  isKnown?: boolean;
  isHard?: boolean;
  selectedAnswer?: string;
  isAnswered?: boolean;
}

export type AnswerStatus = 'correct' | 'incorrect' | 'neutral';

export interface RouteFilter {
  filter?: ListType;
}