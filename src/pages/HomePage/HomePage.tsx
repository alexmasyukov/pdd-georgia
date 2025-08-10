import React from 'react';
import './HomePage.scss';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="home-page__empty">
        <p>Выберите категорию слева для начала тестирования</p>
      </div>
    </div>
  );
};

export default HomePage;