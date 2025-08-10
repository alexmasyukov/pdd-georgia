import type { PaginationResult } from '@types';

class PaginationService {
  static paginate<T>(
    items: T[],
    page: number,
    perPage: number
  ): PaginationResult<T> {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const currentPage = Math.min(Math.max(1, page), totalPages || 1);
    
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedItems = items.slice(startIndex, endIndex);
    
    return {
      items: paginatedItems,
      totalPages,
      currentPage,
      totalItems,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    };
  }
}

export default PaginationService;