import React, { useEffect, useState } from 'react';
import QuestionList from '@components/QuestionList/QuestionList';
import QuestionService from '@services/QuestionService';
import type { Question } from '../../types';

const HardPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const hardQuestions = QuestionService.getHardQuestions();
    setQuestions(hardQuestions);
  }, [updateTrigger]);

  const handleUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div className="hard-page">
      <QuestionList
        questions={questions}
        title="Плохо запоминающиеся вопросы"
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default HardPage;