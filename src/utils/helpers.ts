import type {Question} from '@/types';

export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) {
    return '';
  }
  // Изображения находятся в public/images/ticket_media/new/
  const filename = imagePath.split('/').pop() || imagePath;
  return `/images/ticket_media/new/${filename}`;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const formatQuestionNumber = (num: number): string => {
  return num.toString().padStart(3, '0');
};

export const getCategoryKey = (categoryId: string, listType: string): string => {
  return `${categoryId}-${listType}`;
};

export const parseCategoryKey = (key: string): { categoryId: string; listType: string } | null => {
  const match = key.match(/^(\d+)-(favorite|known|hard)$/);
  if (!match) return null;
  return {
    categoryId: match[1],
    listType: match[2],
  };
};

export const filterQuestionsByIds = (questions: Question[], ids: number[]): Question[] => {
  const idSet = new Set(ids);
  return questions.filter(q => idSet.has(q.id));
};

export const paginateItems = <T>(items: T[], page: number, perPage: number): T[] => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return items.slice(start, end);
};

export const calculateTotalPages = (totalItems: number, itemsPerPage: number): number => {
  return Math.ceil(totalItems / itemsPerPage);
};