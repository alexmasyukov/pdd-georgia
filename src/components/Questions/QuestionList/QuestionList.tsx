import React, { useState, useEffect } from 'react';
import QuestionContainer from '../QuestionContainer/QuestionContainer';
import Pagination from '@components/UI/Pagination/Pagination';
import LocalStorageService from '@services/LocalStorageService';
import type { Question } from '@/types';
import { paginateItems } from '@utils/helpers';
import './QuestionList.scss';

interface QuestionListProps {
  questions: Question[];
  title?: string;
  showPagination?: boolean;
  emptyMessage?: string;
  showDetailedHint?: boolean;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  title,
  showPagination = true,
  emptyMessage = 'Нет вопросов для отображения',
  showDetailedHint = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    LocalStorageService.getSettings().perPage
  );
  const [refreshKey, setRefreshKey] = useState(0);


  useEffect(() => {
    // Reset to first page when questions change
    setCurrentPage(1);
  }, [questions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    LocalStorageService.updateSettings({ perPage: value });
    setCurrentPage(1);
  };

  const handleQuestionUpdate = () => {
    // Force re-render to update stats
    setRefreshKey(prev => prev + 1);
  };

  // Sort questions by id
  const sortedQuestions = [...questions].sort((a, b) => a.id - b.id);

  const paginatedQuestions = showPagination
    ? paginateItems(sortedQuestions, currentPage, itemsPerPage)
    : sortedQuestions;

  const totalPages = Math.ceil(questions.length / itemsPerPage);

  if (questions.length === 0) {
    return (
      <div className="question-list question-list--empty">
        <p className="question-list__empty-message">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="question-list" key={refreshKey}>
      {title && <h2 className="question-list__title">{title}</h2>}
      
      <div className="question-list__items">
        {paginatedQuestions.map(question => (
          <QuestionContainer
            key={question.id}
            question={question}
            showDetailedHint={showDetailedHint}
            onQuestionUpdate={handleQuestionUpdate}
          />
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={questions.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default QuestionList;