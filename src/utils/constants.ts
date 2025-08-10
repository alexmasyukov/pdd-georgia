export const PER_PAGE_OPTIONS = [10, 20, 30];
export const DEFAULT_PER_PAGE = 10;
export const MAIN_CATEGORY_ID = 1; // "Водитель, пассажир и пешеход, знаки, условности"

export const LIST_TYPE_LABELS = {
  favorite: 'Избранное',
  known: 'Точно знаю ответ',
  hard: 'Плохо запоминающиеся'
} as const;

export const LIST_TYPE_ICONS = {
  favorite: 'Star',
  known: 'CheckCircle',
  hard: 'Flame'
} as const;