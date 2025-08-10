import React from 'react';
import type { AnswerStatus } from '@types';
import styles from './AnswerOption.module.scss';

interface AnswerOptionProps {
  number: number;
  text: string;
  status: AnswerStatus;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
  number,
  text,
  status,
  isSelected,
  isDisabled,
  onClick
}) => {
  const isEmpty = !text;
  
  const getClassName = () => {
    let className = styles.answerOption;
    if (isEmpty) className += ` ${styles.empty}`;
    if (isDisabled) className += ` ${styles.disabled}`;
    if (isSelected && status === 'neutral') className += ` ${styles.selected}`;
    if (status === 'correct') className += ` ${styles.correct}`;
    if (status === 'incorrect' && isSelected) className += ` ${styles.incorrect}`;
    return className;
  };
  
  return (
    <div
      onClick={!isDisabled && !isEmpty ? onClick : undefined}
      className={getClassName()}
    >
      <div className={styles.number}>
        {number}
      </div>
      
      <div className={styles.text}>
        {text || '—'}
      </div>
    </div>
  );
};

export default AnswerOption;