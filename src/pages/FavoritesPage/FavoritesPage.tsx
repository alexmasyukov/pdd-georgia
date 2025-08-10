import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import QuestionList from '@components/QuestionList/QuestionList';
import QuestionService from '@services/QuestionService';
import type { Question } from '@types';
import './FavoritesPage.scss';

const FavoritesPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const favoriteQuestions = QuestionService.getFavoriteQuestions();
    setQuestions(favoriteQuestions);
  }, [updateTrigger]);

  const handleUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <Box className="favorites-page">
      <QuestionList
        questions={questions}
        title="Избранные вопросы"
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default FavoritesPage;