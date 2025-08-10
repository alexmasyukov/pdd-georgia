import React, { useEffect, useState } from 'react';
import QuestionList from '@components/Questions/QuestionList/QuestionList';
import QuestionService from '@services/QuestionService';
import type { Question } from '@/types';
import './FavoritesPage.scss';

const FavoritesPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuestionService.getAllQuestionsByList('favorite');
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="favorites-page favorites-page--loading">
        <div className="favorites-page__loader">Загрузка избранных вопросов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-page favorites-page--error">
        <div className="favorites-page__error">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-page__header">
        <h1 className="favorites-page__title">⭐ Избранные вопросы</h1>
        <p className="favorites-page__description">
          Все вопросы, которые вы добавили в избранное из всех категорий
        </p>
      </div>

      <QuestionList
        questions={questions}
        emptyMessage="У вас пока нет избранных вопросов. Добавьте вопросы в избранное, чтобы они появились здесь."
      />
    </div>
  );
};

export default FavoritesPage;