import React, { useState, useEffect } from 'react';
import QuestionCard from '@components/QuestionCard/QuestionCard';
import Pagination from '@components/Pagination/Pagination';
import LocalStorageService from '@services/LocalStorageService';
import PaginationService from '@services/PaginationService';
import type { Question } from '@types';
import { scrollToTop } from '@utils/helpers';
import styles from './QuestionList.module.scss';

interface QuestionListProps {
  questions: Question[];
  title?: string;
  showCategoryToggle?: boolean;
  categoryId?: number;
  onUpdate?: () => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  title,
  showCategoryToggle = false,
  categoryId,
  onUpdate
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(LocalStorageService.getPerPage());
  const [isCategoryCompleted, setIsCategoryCompleted] = useState(false);

  useEffect(() => {
    if (categoryId) {
      setIsCategoryCompleted(LocalStorageService.isCategoryCompleted(categoryId));
    }
  }, [categoryId]);

  useEffect(() => {
    // Сбрасываем на первую страницу при изменении списка вопросов
    setCurrentPage(1);
  }, [questions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    LocalStorageService.setPerPage(newPerPage);
  };

  const handleCategoryToggle = () => {
    if (categoryId) {
      LocalStorageService.toggleCategoryCompleted(categoryId);
      setIsCategoryCompleted(!isCategoryCompleted);
      window.dispatchEvent(new Event('localStorageUpdate'));
      onUpdate?.();
    }
  };

  const paginatedData = PaginationService.paginate(questions, currentPage, perPage);

  if (questions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>Нет вопросов для отображения</h3>
        <p>Выберите категорию или добавьте вопросы в списки</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {(title || showCategoryToggle) && (
        <div className={styles.header}>
          {title && (
            <h2 className={styles.title}>
              {title}
            </h2>
          )}
          {showCategoryToggle && categoryId && (
            <div className={styles.categoryToggle}>
              <input
                type="checkbox"
                id="category-completed"
                checked={isCategoryCompleted}
                onChange={handleCategoryToggle}
              />
              <label htmlFor="category-completed">
                Категория изучена
              </label>
            </div>
          )}
        </div>
      )}

      <div className={styles.questionsList}>
        {paginatedData.items.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={(currentPage - 1) * perPage + index + 1}
            total={questions.length}
            onUpdate={onUpdate}
          />
        ))}
      </div>

      <Pagination
        currentPage={paginatedData.currentPage}
        totalPages={paginatedData.totalPages}
        totalItems={paginatedData.totalItems}
        perPage={perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </div>
  );
};

export default QuestionList;