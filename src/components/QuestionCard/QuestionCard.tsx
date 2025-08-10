import React, { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle, Flame, HelpCircle } from 'lucide-react';
import type { Question, ListType, AnswerStatus } from '@types';
import QuestionService from '@services/QuestionService';
import LocalStorageService from '@services/LocalStorageService';
import AnswerOption from './AnswerOption';
import styles from './QuestionCard.module.scss';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  onUpdate?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, total, onUpdate }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<Record<string, AnswerStatus>>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [isKnown, setIsKnown] = useState(false);
  const [isHard, setIsHard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const [helpPosition, setHelpPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Проверяем статус вопроса в списках
    setIsFavorite(LocalStorageService.isQuestionInList(question.category, question.id, 'favorite'));
    setIsKnown(LocalStorageService.isQuestionInList(question.category, question.id, 'known'));
    setIsHard(LocalStorageService.isQuestionInList(question.category, question.id, 'hard'));
  }, [question]);

  const handleAnswerClick = (answerId: string) => {
    if (selectedAnswer) return; // Если уже выбран ответ, не позволяем выбрать другой

    setSelectedAnswer(answerId);
    const isCorrect = QuestionService.checkAnswer(question.id, answerId);
    const correctAnswer = QuestionService.getCorrectAnswer(question.id);

    const newStatus: Record<string, AnswerStatus> = {};
    QuestionService.getAnswers(question).forEach(answer => {
      if (answer.id === answerId) {
        newStatus[answer.id] = isCorrect ? 'correct' : 'incorrect';
      } else if (answer.id === correctAnswer) {
        newStatus[answer.id] = 'correct';
      } else {
        newStatus[answer.id] = 'neutral';
      }
    });
    setAnswerStatus(newStatus);
  };

  const toggleList = (listType: ListType) => {
    LocalStorageService.toggleQuestionInList(question.category, question.id, listType);
    
    switch (listType) {
      case 'favorite':
        setIsFavorite(!isFavorite);
        break;
      case 'known':
        setIsKnown(!isKnown);
        break;
      case 'hard':
        setIsHard(!isHard);
        break;
    }

    // Вызываем событие для обновления статистики
    window.dispatchEvent(new Event('localStorageUpdate'));
    onUpdate?.();
  };

  const handleHelpClick = () => {
    if (helpButtonRef.current) {
      const rect = helpButtonRef.current.getBoundingClientRect();
      setHelpPosition({
        top: rect.bottom + 8,
        left: rect.right - 300
      });
    }
    setShowHelp(!showHelp);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showHelp && helpButtonRef.current && !helpButtonRef.current.contains(event.target as Node)) {
        setShowHelp(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHelp]);

  const imageUrl = question.img;
  const answers = QuestionService.getAnswers(question);

  return (
    <div className={styles.questionCard}>
      <div className={styles.header}>
        <span className={styles.questionNumber}>
          {question.id}
        </span>
        <button
          ref={helpButtonRef}
          onClick={handleHelpClick}
          className={styles.helpButton}
        >
          <HelpCircle size={20} />
        </button>
      </div>

      <div className={styles.imageContainer}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Вопрос" 
          />
        ) : (
          <div className={styles.noImage}>Изображение отсутствует</div>
        )}
      </div>

      <h3 className={styles.questionText}>
        {question.question}
      </h3>

      <div className={styles.answersGrid}>
        {[1, 2, 3, 4].map(num => {
          const answer = answers.find(a => a.id === String(num));
          return (
            <AnswerOption
              key={num}
              number={num}
              text={answer?.text || ''}
              status={answerStatus[String(num)] || 'neutral'}
              isSelected={selectedAnswer === String(num)}
              isDisabled={!answer || selectedAnswer !== null}
              onClick={() => answer && handleAnswerClick(String(num))}
            />
          );
        })}
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => toggleList('favorite')}
          className={`${styles.actionButton} ${styles.favorite} ${isFavorite ? styles.active : ''}`}
        >
          {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        </button>

        <button
          onClick={() => toggleList('known')}
          className={`${styles.actionButton} ${styles.known} ${isKnown ? styles.active : ''}`}
        >
          {isKnown ? 'Удалить из "Точно знаю"' : 'Точно знаю ответ'}
        </button>

        <button
          onClick={() => toggleList('hard')}
          className={`${styles.actionButton} ${styles.hard} ${isHard ? styles.active : ''}`}
        >
          {isHard ? 'Удалить из сложных' : 'Плохо запоминается'}
        </button>
      </div>

      {showHelp && (
        <div 
          className={styles.popover}
          style={{ top: helpPosition.top, left: helpPosition.left }}
        >
          <div className={styles.popoverTitle}>
            Объяснение:
          </div>
          <div className={styles.popoverContent}>
            {question.question_explained}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;