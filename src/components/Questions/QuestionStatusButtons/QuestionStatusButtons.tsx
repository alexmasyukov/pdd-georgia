import React, { memo, useState } from 'react';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import QuestionService from '@services/QuestionService';
import useCategoryUpdateStore from '@stores/useCategoryUpdateStore';
import type { Question } from '@/types';

interface QuestionStatusButtonsProps {
  question: Question;
}

const QuestionStatusButtons: React.FC<QuestionStatusButtonsProps> = memo(({ 
  question, 
}) => {
  const [stats, setStats] = useState(QuestionService.getQuestionStats(question));
  const triggerCategoryButtonsUpdate = useCategoryUpdateStore(state => state.triggerCategoryButtonsUpdate);

  const toggleList = (listType: 'favorite' | 'known' | 'hard') => {
    QuestionService.toggleQuestionInList(question, listType);
    setStats(prev => ({
      ...prev,
      isFavorite: listType === 'favorite' ? !prev.isFavorite : prev.isFavorite,
      isKnown: listType === 'known' ? !prev.isKnown : prev.isKnown,
      isHard: listType === 'hard' ? !prev.isHard : prev.isHard,
    }));
    triggerCategoryButtonsUpdate();
  };

  return (
    <div className="question-container__buttons">
      <button
        className={`question-container__button ${stats.isFavorite ? 'question-container__button--favorite' : ''}`}
        onClick={() => toggleList('favorite')}
        type="button"
      >
        <Star size={17} stroke={'currentColor'} />
        <span>{stats.isFavorite ? 'В избранном' : 'В избранное'}</span>
      </button>

      <button
        className={`question-container__button ${stats.isKnown ? 'question-container__button--known' : ''}`}
        onClick={() => toggleList('known')}
        type="button"
      >
        <CheckCircle size={17} stroke={'currentColor'} />
        <span>{stats.isKnown ? 'Точно знаю' : 'Точно знаю ответ'}</span>
      </button>

      <button
        className={`question-container__button ${stats.isHard ? 'question-container__button--hard' : ''}`}
        onClick={() => toggleList('hard')}
        type="button"
      >
        <AlertCircle size={17} stroke={'currentColor'} />
        <span>{stats.isHard ? 'Сложный' : 'Плохо запоминается'}</span>
      </button>
    </div>
  );
});

QuestionStatusButtons.displayName = 'QuestionStatusButtons';

export default QuestionStatusButtons;