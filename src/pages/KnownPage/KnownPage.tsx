import React, { useEffect, useState } from 'react';
import QuestionList from '@components/QuestionList/QuestionList';
import QuestionService from '@services/QuestionService';
import type { Question } from '@types';

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
    <div className="known-page">
      <QuestionList
        questions={questions}
        title="Вопросы, которые точно знаю"
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default KnownPage;