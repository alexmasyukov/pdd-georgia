import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, IconButton, Popover, Chip } from '@mui/material';
import { Star, CheckCircle, Flame, HelpCircle } from 'lucide-react';
import type { Question, ListType, AnswerStatus } from '@types';
import QuestionService from '@services/QuestionService';
import LocalStorageService from '@services/LocalStorageService';
import AnswerOption from './AnswerOption';
import './QuestionCard.scss';

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

  const imageUrl = QuestionService.getQuestionImage(question);
  const answers = QuestionService.getAnswers(question);
  const helpOpen = Boolean(anchorEl);

  return (
    <Card className="question-card">
      <CardContent className="question-card__content">
        <Box className="question-card__header">
          <Chip 
            label={`№${index} из ${total}`} 
            size="small" 
            className="question-card__number"
          />
          <IconButton 
            onClick={handleHelpClick}
            className="question-card__help"
            size="small"
          >
            <HelpCircle size={20} />
          </IconButton>
        </Box>

        {imageUrl && (
          <Box className="question-card__image-container">
            <img 
              src={imageUrl} 
              alt="Вопрос" 
              className="question-card__image"
            />
          </Box>
        )}

        <Typography variant="h6" className="question-card__question">
          {question.question}
        </Typography>

        <Box className="question-card__answers">
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

        <Box className="question-card__actions">
          <Button
            size="small"
            startIcon={<Star size={16} />}
            onClick={() => toggleList('favorite')}
            className={`question-card__action ${isFavorite ? 'active favorite' : ''}`}
          >
            {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          </Button>

          <Button
            size="small"
            startIcon={<CheckCircle size={16} />}
            onClick={() => toggleList('known')}
            className={`question-card__action ${isKnown ? 'active known' : ''}`}
          >
            {isKnown ? 'Удалить из "Точно знаю"' : 'Точно знаю ответ'}
          </Button>

          <Button
            size="small"
            startIcon={<Flame size={16} />}
            onClick={() => toggleList('hard')}
            className={`question-card__action ${isHard ? 'active hard' : ''}`}
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
        <Box className="question-card__popover">
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