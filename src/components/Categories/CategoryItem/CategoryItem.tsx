import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { Category, CategoryStats } from '@/types';
import './CategoryItem.scss';

interface CategoryItemProps {
  category: Category;
  stats?: CategoryStats;
  isActive?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  stats,
  isActive = false,
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/category/${category.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const favoriteCount = stats?.favoriteCount || 0;
  const knownCount = stats?.knownCount || 0;
  const hardCount = stats?.hardCount || 0;
  const totalCount = stats?.totalCount || 0;

  const isCompleted = stats?.isCompleted || false;

  return (
    <div className={`category-item ${isActive ? 'category-item--active' : ''} ${isCompleted ? 'category-item--completed' : ''}`}>
      <div className="category-item__main" onClick={handleCategoryClick}>
        <h3 className="category-item__name">
          {category.id}. {category.name} {totalCount > 0 && <span className="category-item__count">({totalCount})</span>}
        </h3>
      </div>
      
      <div className="category-item__links">
        {favoriteCount > 0 && (
          <NavLink 
            to={`/category/${category.id}/favorites`}
            className={({ isActive }) => `category-item__link ${isActive ? 'category-item__link--active' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            избранное ({favoriteCount})
          </NavLink>
        )}
        
        {knownCount > 0 && (
          <NavLink 
            to={`/category/${category.id}/known`}
            className={({ isActive }) => `category-item__link ${isActive ? 'category-item__link--active' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            точно знаю ({knownCount})
          </NavLink>
        )}
        
        {hardCount > 0 && (
          <NavLink 
            to={`/category/${category.id}/hard`}
            className={({ isActive }) => `category-item__link ${isActive ? 'category-item__link--active' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            сложные ({hardCount})
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default CategoryItem;