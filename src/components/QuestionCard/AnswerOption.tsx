import React from 'react';
import { Box, Typography } from '@mui/material';
import type { AnswerStatus } from '@types';

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
  
  const getStatusColor = () => {
    if (status === 'correct') return 'success.main';
    if (status === 'incorrect' && isSelected) return 'error.main';
    return 'transparent';
  };

  const getBackgroundColor = () => {
    if (isEmpty) return 'rgba(255, 255, 255, 0.08)';
    if (status === 'correct') return 'rgba(76, 175, 80, 0.15)';
    if (status === 'incorrect' && isSelected) return 'rgba(244, 67, 54, 0.15)';
    if (isSelected) return 'rgba(25, 118, 210, 0.15)';
    return 'rgba(255, 255, 255, 0.05)';
  };
  
  return (
    <Box
      onClick={!isDisabled && !isEmpty ? onClick : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1.5,
        border: 2,
        borderColor: getStatusColor(),
        borderRadius: 1,
        backgroundColor: getBackgroundColor(),
        cursor: !isDisabled && !isEmpty ? 'pointer' : 'default',
        opacity: isEmpty ? 0.5 : 1,
        '&:hover': {
          backgroundColor: !isDisabled && !isEmpty && status === 'neutral' ? 'rgba(255, 255, 255, 0.12)' : getBackgroundColor()
        },
        transition: 'all 0.2s ease'
      }}
    >
      <Box
        sx={{
          minWidth: 32,
          height: 32,
          borderRadius: 1,
          backgroundColor: isEmpty ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          border: 1,
          borderColor: 'rgba(255, 255, 255, 0.23)'
        }}
      >
        {number}
      </Box>
      
      <Typography sx={{ flex: 1 }}>
        {text || '—'}
      </Typography>
    </Box>
  );
};

export default AnswerOption;