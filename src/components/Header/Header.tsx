import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Flame, Home, Star } from 'lucide-react';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>
        ПДД Грузии - Тестирование
      </h1>

      <nav className={styles.nav}>
        <Link
          to="/"
          className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
        >
          <Home size={18} />
          Главная
        </Link>

        <Link
          to="/favorites"
          className={`${styles.navLink} ${isActive('/favorites') ? styles.active : ''}`}
        >
          <Star size={18} />
          Избранное
        </Link>

        <Link
          to="/known"
          className={`${styles.navLink} ${isActive('/known') ? styles.active : ''}`}
        >
          <CheckCircle size={18} />
          Точно знаю
        </Link>

        <Link
          to="/hard"
          className={`${styles.navLink} ${isActive('/hard') ? styles.active : ''}`}
        >
          <Flame size={18} />
          Сложные
        </Link>
      </nav>
    </div>
  );
};

export default Header;