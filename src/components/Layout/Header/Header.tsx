import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import LocalStorageService from '@services/LocalStorageService';
import './Header.scss';

const Header: React.FC = () => {
  const location = useLocation();
  const [counts, setCounts] = useState({
    favorites: 0,
    known: 0,
    hard: 0
  });

  useEffect(() => {
    // Update counts when location changes (in case user adds/removes items)
    const updateCounts = () => {
      const favoriteIds = LocalStorageService.getAllQuestionIdsByListType('favorite');
      const knownIds = LocalStorageService.getAllQuestionIdsByListType('known');
      const hardIds = LocalStorageService.getAllQuestionIdsByListType('hard');
      
      setCounts({
        favorites: favoriteIds.length,
        known: knownIds.length,
        hard: hardIds.length
      });
    };

    updateCounts();
  }, [location]);

  return (
    <header className="header">
      <nav className="header__nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
        >
          Главная
        </NavLink>
        <NavLink 
          to="/favorites" 
          className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
        >
          Избранное {counts.favorites > 0 && `(${counts.favorites})`}
        </NavLink>
        <NavLink 
          to="/known" 
          className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
        >
          Точно знаю {counts.known > 0 && `(${counts.known})`}
        </NavLink>
        <NavLink 
          to="/hard" 
          className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
        >
          Сложные {counts.hard > 0 && `(${counts.hard})`}
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;