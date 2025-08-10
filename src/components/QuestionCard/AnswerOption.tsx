import React from 'react';
import { Box, Typography } from '@mui/material';
import { Check, X } from 'lucide-react';
import type { AnswerStatus } from '@types';
import './QuestionCard.scss';

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
  
  return (
    <Box
      className={`answer-option ${status} ${isSelected ? 'selected' : ''} ${isEmpty ? 'empty' : ''} ${isDisabled && !isEmpty ? 'disabled' : ''}`}
      onClick={!isDisabled && !isEmpty ? onClick : undefined}
    >
      <Box className="answer-option__number">
        {number}
      </Box>
      
      <Typography className="answer-option__text">
        {text || '—'}
      </Typography>
      
      {status === 'correct' && (
        <Check className="answer-option__icon correct" size={20} />
      )}
      {status === 'incorrect' && isSelected && (
        <X className="answer-option__icon incorrect" size={20} />
      )}
    </Box>
  );
};

export default AnswerOption;