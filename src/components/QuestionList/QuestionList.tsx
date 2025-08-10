import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import QuestionCard from '@components/QuestionCard/QuestionCard';
import Pagination from '@components/Pagination/Pagination';
import LocalStorageService from '@services/LocalStorageService';
import PaginationService from '@services/PaginationService';
import type { Question } from '@types';
import { scrollToTop } from '@utils/helpers';

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
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" gutterBottom>
          Нет вопросов для отображения
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Выберите категорию или добавьте вопросы в списки
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {(title || showCategoryToggle) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          {title && (
            <Typography variant="h5">
              {title}
            </Typography>
          )}
          {showCategoryToggle && categoryId && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCategoryCompleted}
                  onChange={handleCategoryToggle}
                  color="success"
                />
              }
              label="Категория изучена"
            />
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {paginatedData.items.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={(currentPage - 1) * perPage + index + 1}
            total={questions.length}
            onUpdate={onUpdate}
          />
        ))}
      </Box>

      <Pagination
        currentPage={paginatedData.currentPage}
        totalPages={paginatedData.totalPages}
        totalItems={paginatedData.totalItems}
        perPage={perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </Box>
  );
};

export default QuestionList;