import React from 'react';
import QuestionCard from '../QuestionCard/QuestionCard';
import QuestionStatusButtons from '../QuestionStatusButtons/QuestionStatusButtons';
import type { Question } from '@/types';
import './QuestionContainer.scss';

interface QuestionContainerProps {
  question: Question;
  showDetailedHint?: boolean;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({ question, showDetailedHint }) => {
  return (
    <div className="question-container">
      <QuestionCard question={question} showDetailedHint={showDetailedHint}  />
      <QuestionStatusButtons question={question} />
    </div>
  );
};

export default QuestionContainer;