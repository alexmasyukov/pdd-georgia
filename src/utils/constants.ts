export const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'settings',
  COMPLETE: 'complete',
  SHOW_DETAILED_HINT: 'showDetailedHint',
} as const;

export const DEFAULT_SETTINGS = {
  perPage: 10,
};

export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30];

export const ROUTES = {
  HOME: '/',
  CATEGORY: '/category/:id',
  FAVORITES: '/favorites',
  KNOWN: '/known',
  HARD: '/hard',
  CATEGORY_FAVORITES: '/category/:id/favorites',
  CATEGORY_KNOWN: '/category/:id/known',
  CATEGORY_HARD: '/category/:id/hard',
} as const;

export const API_ENDPOINTS = {
  CATEGORIES: '/categories.json',
  QUESTIONS: '/ru.json',
  IMAGES: '/images/',
} as const;