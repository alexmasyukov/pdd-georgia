import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import AnswerOption from '../AnswerOption/AnswerOption';
import QuestionService from '@services/QuestionService';
import type { Question } from '@/types';
import { formatQuestionNumber, getImageUrl } from '@utils/helpers';
import './QuestionCard.scss';

interface QuestionCardProps {
  question: Question;
  showDetailedHint?: boolean;
  onQuestionUpdate?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, showDetailedHint = false }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const answers = QuestionService.getAnswers(question);

  const handleAnswerClick = (answerNumber: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answerNumber);
    setShowResult(true);
  };


  return (
    <div className="question-card">
      {question.question_explained && (
        <button 
          className="question-card__hint-button"
          onClick={() => setShowHint(true)}
          type="button"
          aria-label="Показать подсказку"
        >
          <HelpCircle size={20} />
        </button>
      )}
      {showHint && question.question_explained && (
        <div className="question-card__hint">
          <button 
            className="question-card__hint-close"
            onClick={() => setShowHint(false)}
            type="button"
            aria-label="Закрыть подсказку"
          >
            <X size={16} />
          </button>
          <div className="question-card__hint-content">
            {question.question_explained}
          </div>
        </div>
      )}
      <div className="question-card__image-section">
        <span className="question-card__number">
          {formatQuestionNumber(question.id)}
        </span>
        {question.hasImg === 1 && question.img ? (
          <img
            src={getImageUrl(question.img)}
            alt="Изображение к вопросу"
          />
        ) : (
          <div className="question-card__image-placeholder">
            {/* Placeholder with background image */}
          </div>
        )}
      </div>

      <div className="question-card__question">
        {question.question}
      </div>

      {showDetailedHint && question.question_explained_detailed && (
        <div className="question-card__detailed-hint">
          <div className="question-card__detailed-hint-content">
            {question.question_explained_detailed}
          </div>
        </div>
      )}

      <div className="question-card__answers">
        {answers.map((answer) => {
          // Определяем, является ли этот ответ правильным
          const isThisCorrectAnswer = QuestionService.checkAnswer(question, answer.number);
          const shouldShowAsCorrect = showResult && isThisCorrectAnswer;
          const shouldShowAsIncorrect = showResult && selectedAnswer === answer.number && !isThisCorrectAnswer;
          
          return (
            <AnswerOption
              key={answer.number}
              number={answer.number}
              text={answer.text!}
              isSelected={selectedAnswer === answer.number}
              isCorrect={
                showResult ? (
                  shouldShowAsCorrect ? true : 
                  shouldShowAsIncorrect ? false : 
                  null
                ) : null
              }
              showResult={showResult}
              onClick={() => handleAnswerClick(answer.number)}
              disabled={showResult}
            />
          );
        })}
      </div>

    </div>
  );
};

export default QuestionCard;