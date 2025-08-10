import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, Flame } from 'lucide-react';
import type { Category, CategoryStats } from '@types';
import styles from './CategoryItem.module.scss';

interface CategoryItemProps {
  category: Category;
  stats: CategoryStats;
  isActive: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, stats, isActive }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/category/${category.id}`);
  };

  return (
    <div className={styles.categoryItem}>
      <div 
        onClick={handleCategoryClick}
        className={`${styles.card} ${isActive ? styles.active : ''} ${stats.isCompleted ? styles.completed : ''}`}
      >
        <h3 className={styles.title}>
          {category.name}
        </h3>
      </div>
      
      <div className={styles.links}>
        {stats.favorites > 0 && (
          <Link
            to={`/category/${category.id}/favorites`}
            className={`${styles.link} ${styles.favorites}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Star size={14} />
            избранное ({stats.favorites})
          </Link>
        )}
        {stats.known > 0 && (
          <Link
            to={`/category/${category.id}/known`}
            className={`${styles.link} ${styles.known}`}
            onClick={(e) => e.stopPropagation()}
          >
            <CheckCircle size={14} />
            знаю ({stats.known})
          </Link>
        )}
        {stats.hard > 0 && (
          <Link
            to={`/category/${category.id}/hard`}
            className={`${styles.link} ${styles.hard}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Flame size={14} />
            сложные ({stats.hard})
          </Link>
        )}
      </div>
    </div>
  );
};

export default CategoryItem;