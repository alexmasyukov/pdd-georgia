import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import CategoryService from '@services/CategoryService';
import useCategoryUpdateStore from '@stores/useCategoryUpdateStore';
import type { CategoryStats } from '@/types';
import './CategoryListLinks.scss';

interface CategoryListLinksProps {
  categoryId: string;
}

const CategoryListLinks: React.FC<CategoryListLinksProps> = ({ categoryId }) => {
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const needToCategoryButtonsUpdate = useCategoryUpdateStore(state => state.needToCategoryButtonsUpdate);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const categoryStats = await CategoryService.getCategoryStats(categoryId);
        setStats(categoryStats);
      } catch (err) {
        console.error('Error loading category stats:', err);
      }
    };
    
    loadStats();
  }, [categoryId]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const categoryStats = await CategoryService.getCategoryStats(categoryId);
        setStats(categoryStats);
      } catch (err) {
        console.error('Error loading category stats:', err);
      }
    };
    
    if (needToCategoryButtonsUpdate) {
      loadStats();
    }
  }, [needToCategoryButtonsUpdate, categoryId]);


  if (!stats) return null;

  const favoriteCount = stats.favoriteCount || 0;
  const knownCount = stats.knownCount || 0;
  const hardCount = stats.hardCount || 0;
  const totalCount = stats.totalCount || 0;

  return (
    <div className="category-list-links">
        <NavLink 
          to={`/category/${categoryId}`}
          end
          className={({ isActive }) => `category-list-links__link ${isActive ? 'category-list-links__link--active' : ''}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Все вопросы категории – {totalCount}
        </NavLink>


          <NavLink 
            to={`/category/${categoryId}/favorites`}
            className={({ isActive }) => `category-list-links__link ${isActive ? 'category-list-links__link--active' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            избранное ({favoriteCount})
          </NavLink>



          <NavLink 
            to={`/category/${categoryId}/known`}
            className={({ isActive }) => `category-list-links__link ${isActive ? 'category-list-links__link--active' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            точно знаю ({knownCount})
          </NavLink>

      

          <NavLink 
            to={`/category/${categoryId}/hard`}
            className={({ isActive }) => `category-list-links__link ${isActive ? 'category-list-links__link--active' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            сложные ({hardCount})
          </NavLink>

    </div>
  );
};

export default CategoryListLinks;