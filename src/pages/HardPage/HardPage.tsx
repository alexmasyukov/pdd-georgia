import React, { useEffect, useState } from 'react';
import QuestionList from '@components/Questions/QuestionList/QuestionList';
import QuestionService from '@services/QuestionService';
import type { Question } from '@/types';
import './HardPage.scss';

const HardPage: React.FC = () => {
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
      const data = await QuestionService.getAllQuestionsByList('hard');
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="hard-page hard-page--loading">
        <div className="hard-page__loader">Загрузка сложных вопросов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hard-page hard-page--error">
        <div className="hard-page__error">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="hard-page">
      <div className="hard-page__header">
        <h1 className="hard-page__title">🔥 Плохо запоминающиеся вопросы</h1>
        <p className="hard-page__description">
          Вопросы, которые требуют дополнительного внимания и повторения
        </p>
      </div>

      <QuestionList
        questions={questions}
        emptyMessage="У вас пока нет сложных вопросов. Отметьте вопросы, которые плохо запоминаются."
      />
    </div>
  );
};

export default HardPage;