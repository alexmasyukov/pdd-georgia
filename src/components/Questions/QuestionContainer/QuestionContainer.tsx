import React from 'react';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import QuestionCard from '../QuestionCard/QuestionCard';
import QuestionService from '@services/QuestionService';
import type { Question } from '@/types';
import './QuestionContainer.scss';

interface QuestionContainerProps {
  question: Question;
  onQuestionUpdate?: () => void;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({ question, onQuestionUpdate }) => {
  const stats = QuestionService.getQuestionStats(question);

  const toggleList = (listType: 'favorite' | 'known' | 'hard') => {
    QuestionService.toggleQuestionInList(question, listType);
    onQuestionUpdate?.();
  };

  return (
    <div className="question-container">
      <QuestionCard question={question} onQuestionUpdate={onQuestionUpdate} />
      
      <div className="question-container__buttons">
        <button
          className={`question-container__button ${stats.isFavorite ? 'question-container__button--favorite' : ''}`}
          onClick={() => toggleList('favorite')}
          type="button"
        >
          <Star size={17} stroke={stats.isFavorite ? 'currentColor' : 'none'} />
          <span>{stats.isFavorite ? 'В избранном' : 'В избранное'}</span>
        </button>

        <button
          className={`question-container__button ${stats.isKnown ? 'question-container__button--known' : ''}`}
          onClick={() => toggleList('known')}
          type="button"
        >
          <CheckCircle size={17} stroke={stats.isKnown ? 'currentColor' : 'none'} />
          <span>{stats.isKnown ? 'Точно знаю' : 'Точно знаю ответ'}</span>
        </button>

        <button
          className={`question-container__button ${stats.isHard ? 'question-container__button--hard' : ''}`}
          onClick={() => toggleList('hard')}
          type="button"
        >
          <AlertCircle size={17} stroke={stats.isHard ? 'currentColor' : 'none'} />
          <span>{stats.isHard ? 'Сложный' : 'Плохо запоминается'}</span>
        </button>
      </div>
    </div>
  );
};

export default QuestionContainer;