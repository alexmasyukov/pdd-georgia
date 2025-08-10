import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PER_PAGE_OPTIONS } from '@utils/constants';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  onPerPageChange
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onPerPageChange(Number(event.target.value));
    onPageChange(1); // Reset to first page when changing items per page
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <div className={styles.perPageSelector}>
        <label>Вопросов на странице:</label>
        <select
          value={perPage}
          onChange={handlePerPageChange}
        >
          {PER_PAGE_OPTIONS.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.controls}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={styles.button}
        >
          <ChevronLeft size={18} />
          Назад
        </button>

        <span className={styles.pageInfo}>
          Страница {currentPage} из {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={styles.button}
        >
          Вперед
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={styles.totalInfo}>
        Всего вопросов: {totalItems}
      </div>
    </div>
  );
};

export default Pagination;