import React from 'react';
import { Book } from 'lucide-react';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.icon}>
        <Book size={64} />
      </div>
      <h1 className={styles.title}>
        Добро пожаловать в тестирование ПДД Грузии
      </h1>
      <p className={styles.subtitle}>
        Выберите категорию слева для начала тестирования
      </p>
      <div className={styles.features}>
        <h3>Возможности приложения:</h3>
        <ul>
          <li>Тестирование по категориям ПДД</li>
          <li>Добавление вопросов в избранное для повторения</li>
          <li>Отметка вопросов, которые вы точно знаете</li>
          <li>Выделение сложных вопросов для дополнительной практики</li>
          <li>Подсказки и объяснения к каждому вопросу</li>
          <li>Отслеживание прогресса по категориям</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;