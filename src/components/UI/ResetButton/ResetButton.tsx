import React from 'react';
import { useNavigate } from 'react-router-dom';
import LocalStorageService from '@services/LocalStorageService';
import './ResetButton.scss';

interface ResetButtonProps {
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  color?: 'red' | 'gray';
}

const ResetButton: React.FC<ResetButtonProps> = ({ 
  variant = 'filled', 
  size = 'medium',
  color = 'red'
}) => {
  const navigate = useNavigate();

  const handleReset = () => {
    const firstConfirm = window.confirm('Вы действительно хотите сбросить весь прогресс, очистить списки?');
    
    if (firstConfirm) {
      const secondConfirm = window.confirm('Подтверждаете удаление и очистку?');
      
      if (secondConfirm) {
        LocalStorageService.clearAll();
        navigate('/');
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <button
      className={`reset-button reset-button--${variant} reset-button--${size} reset-button--${color}`}
      onClick={handleReset}
      type="button"
    >
      Очистить все списки и сбросить весь прогресс
    </button>
  );
};

export default ResetButton;