import React, { useEffect, useState } from 'react';
import CategoryService from '@services/CategoryService';
import './HomePage.scss';

const HomePage: React.FC = () => {
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await CategoryService.getAllCategoriesStats();
        const total = Object.values(stats).reduce((sum, stat) => sum + (stat.totalCount || 0), 0);
        setTotalQuestions(total);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="home-page">
      <div className="home-page__content">
        <h1 className="home-page__title">Тесты ПДД Грузия</h1>
        {!loading && (
          <div className="home-page__stats">
            <p className="home-page__stat">Всего вопросов: <strong>{totalQuestions}</strong></p>
            <p className="home-page__update">Обновлено: 14.08.2025</p>
          </div>
        )}
        <p className="home-page__instruction">Выберите категорию слева для начала тестирования</p>
      </div>
    </div>
  );
};

export default HomePage;