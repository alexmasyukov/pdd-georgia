import React, { useEffect, useState } from 'react';
import QuestionList from '@components/Questions/QuestionList/QuestionList';
import QuestionService from '@services/QuestionService';
import type { Question } from '@/types';
import './KnownPage.scss';

const KnownPage: React.FC = () => {
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
      const data = await QuestionService.getAllQuestionsByList('known');
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="known-page known-page--loading">
        <div className="known-page__loader">Загрузка вопросов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="known-page known-page--error">
        <div className="known-page__error">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="known-page">
      <div className="known-page__header">
        <h1 className="known-page__title">✅ Точно знаю ответ</h1>
        <p className="known-page__description">
          Вопросы, на которые вы точно знаете правильный ответ
        </p>
      </div>

      <QuestionList
        questions={questions}
        emptyMessage="У вас пока нет вопросов в этом списке. Отметьте вопросы, на которые вы точно знаете ответ."
      />
    </div>
  );
};

export default KnownPage;