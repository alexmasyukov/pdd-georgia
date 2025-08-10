import React, { useEffect, useState } from 'react';
import QuestionList from '@components/QuestionList/QuestionList';
import QuestionService from '@services/QuestionService';
import type { Question } from '@types';

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
    <div className="favorites-page">
      <QuestionList
        questions={questions}
        title="Избранные вопросы"
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default FavoritesPage;