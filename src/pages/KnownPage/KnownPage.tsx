import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import QuestionList from '@components/QuestionList/QuestionList';
import QuestionService from '@services/QuestionService';
import type { Question } from '@types';
import './KnownPage.scss';

const KnownPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const knownQuestions = QuestionService.getKnownQuestions();
    setQuestions(knownQuestions);
  }, [updateTrigger]);

  const handleUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <Box className="known-page">
      <QuestionList
        questions={questions}
        title="Вопросы, которые точно знаю"
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default KnownPage;