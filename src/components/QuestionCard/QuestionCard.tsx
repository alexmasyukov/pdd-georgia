import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, IconButton, Popover, Chip } from '@mui/material';
import { Star, CheckCircle, Flame, HelpCircle } from 'lucide-react';
import type { Question, ListType, AnswerStatus } from '@types';
import QuestionService from '@services/QuestionService';
import LocalStorageService from '@services/LocalStorageService';
import AnswerOption from './AnswerOption';

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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

  const handleHelpClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleHelpClose = () => {
    setAnchorEl(null);
  };

  const imageUrl = question.img;
  const answers = QuestionService.getAnswers(question);
  const helpOpen = Boolean(anchorEl);

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip 
            label={question.id} 
            size="small"
          />
          <IconButton 
            onClick={handleHelpClick}
            size="small"
          >
            <HelpCircle size={20} />
          </IconButton>
        </Box>

        {imageUrl && (
          <Box mb={2} textAlign="center">
            <img 
              src={imageUrl} 
              alt="Вопрос" 
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
        )}

        <Typography variant="h6" mb={3}>
          {question.question}
        </Typography>

        <Box mb={3} sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: 2
        }}>
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
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button

            size="small"
            variant="outlined"
            startIcon={<Star size={16} />}
            onClick={() => toggleList('favorite')}
            color={isFavorite ? 'warning' : 'primary'}
          >
            {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<CheckCircle size={16} />}
            onClick={() => toggleList('known')}
            color={isKnown ? 'success' : 'primary'}
          >
            {isKnown ? 'Удалить из "Точно знаю"' : 'Точно знаю ответ'}
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<Flame size={16} />}
            onClick={() => toggleList('hard')}
            color={isHard ? 'error' : 'primary'}
          >
            {isHard ? 'Удалить из сложных' : 'Плохо запоминается'}
          </Button>
        </Box>
      </CardContent>

      <Popover
        open={helpOpen}
        anchorEl={anchorEl}
        onClose={handleHelpClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box p={2} maxWidth={300}>
          <Typography variant="subtitle2" gutterBottom>
            Объяснение:
          </Typography>
          <Typography variant="body2">
            {question.question_explained}
          </Typography>
        </Box>
      </Popover>
    </Card>
  );
};

export default QuestionCard;