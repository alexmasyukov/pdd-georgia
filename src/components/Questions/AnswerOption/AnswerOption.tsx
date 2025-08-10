import React from 'react';
import './AnswerOption.scss';

interface AnswerOptionProps {
  number: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean | null;
  showResult: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
  number,
  text,
  isSelected,
  isCorrect,
  showResult,
  onClick,
  disabled = false,
}) => {
  const getClassName = () => {
    const classes = ['answer-option'];
    
    if (isSelected) {
      classes.push('answer-option--selected');
    }
    
    // Отображаем цвета для правильных/неправильных ответов
    if (showResult && isCorrect !== null) {
      if (isCorrect) {
        classes.push('answer-option--correct');
      } else {
        classes.push('answer-option--incorrect');
      }
    }
    
    if (disabled) {
      classes.push('answer-option--disabled');
    }
    
    return classes.join(' ');
  };

  return (
    <button
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <span className="answer-option__number">{number}</span>
      <span className="answer-option__text">{text}</span>
    </button>
  );
};

export default AnswerOption;