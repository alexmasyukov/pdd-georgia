import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Book } from 'lucide-react';
const HomePage: React.FC = () => {
  return (
    <Box>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Book size={64} />
        </Box>
        <Typography variant="h4" gutterBottom>
          Добро пожаловать в тестирование ПДД Грузии
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Выберите категорию слева для начала тестирования
        </Typography>
        <Box sx={{ mt: 4, textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>
            Возможности приложения:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1">✓ Тестирование по категориям ПДД</Typography>
            <Typography component="li" variant="body1">✓ Добавление вопросов в избранное для повторения</Typography>
            <Typography component="li" variant="body1">✓ Отметка вопросов, которые вы точно знаете</Typography>
            <Typography component="li" variant="body1">✓ Выделение сложных вопросов для дополнительной практики</Typography>
            <Typography component="li" variant="body1">✓ Подсказки и объяснения к каждому вопросу</Typography>
            <Typography component="li" variant="body1">✓ Отслеживание прогресса по категориям</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default HomePage;