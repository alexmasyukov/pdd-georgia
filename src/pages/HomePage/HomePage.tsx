import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Book } from 'lucide-react';
import './HomePage.scss';

const HomePage: React.FC = () => {
  return (
    <Box className="home-page">
      <Paper className="home-page__welcome">
        <Box className="home-page__icon">
          <Book size={64} />
        </Box>
        <Typography variant="h4" className="home-page__title">
          Добро пожаловать в тестирование ПДД Грузии
        </Typography>
        <Typography variant="body1" className="home-page__description">
          Выберите категорию слева для начала тестирования
        </Typography>
        <Box className="home-page__features">
          <Typography variant="h6" gutterBottom>
            Возможности приложения:
          </Typography>
          <ul className="home-page__list">
            <li>Тестирование по категориям ПДД</li>
            <li>Добавление вопросов в избранное для повторения</li>
            <li>Отметка вопросов, которые вы точно знаете</li>
            <li>Выделение сложных вопросов для дополнительной практики</li>
            <li>Подсказки и объяснения к каждому вопросу</li>
            <li>Отслеживание прогресса по категориям</li>
          </ul>
        </Box>
      </Paper>
    </Box>
  );
};

export default HomePage;