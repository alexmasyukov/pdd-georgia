import React, { useState } from 'react';
import AnswerOption from '../AnswerOption/AnswerOption';
import QuestionService from '@services/QuestionService';
import type { Question } from '@/types';
import { formatQuestionNumber, getImageUrl } from '@utils/helpers';
import './QuestionCard.scss';

interface QuestionCardProps {
  question: Question;
  onQuestionUpdate?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [imageError, setImageError] = useState(false);

  const answers = QuestionService.getAnswers(question);

  const handleAnswerClick = (answerNumber: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answerNumber);
    setShowResult(true);
  };


  return (
    <div className="question-card">
      <div className="question-card__image-section">
        <span className="question-card__number">
          {formatQuestionNumber(question.id)}
        </span>
        {question.hasImg === 1 && question.img ? (
          !imageError ? (
            <img
              src={getImageUrl(question.img)}
              alt="Изображение к вопросу"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="question-card__image-placeholder">
              Изображение недоступно
            </div>
          )
        ) : (
          <div className="question-card__image-placeholder">
            {/* Empty placeholder when no image */}
          </div>
        )}
      </div>

      <div className="question-card__question">
        {question.question}
      </div>

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