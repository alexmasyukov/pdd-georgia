import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CategoryItem from '../CategoryItem/CategoryItem';
import CategoryService from '@services/CategoryService';
import useCategoryUpdateStore from '@stores/useCategoryUpdateStore';
import type { Category, CategoryStats } from '@/types';
import './CategoryList.scss';

const CategoryList: React.FC = () => {
  const { id: activeCategoryId } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesStats, setCategoriesStats] = useState<Record<string, CategoryStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const needToCategoryButtonsUpdate = useCategoryUpdateStore(state => state.needToCategoryButtonsUpdate);

  useEffect(() => {
    loadCategories();
  }, []);

  // Auto-close categories on mobile when category changes
  useEffect(() => {
    if (activeCategoryId && window.innerWidth <= 767) {
      setIsExpanded(false);
    }
  }, [activeCategoryId]);

  useEffect(() => {
    if (needToCategoryButtonsUpdate && activeCategoryId) {
      loadCategoryStats(activeCategoryId);
    }
  }, [needToCategoryButtonsUpdate, activeCategoryId]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesArray = await CategoryService.getCategoriesArray();
      const stats = await CategoryService.getAllCategoriesStats();
      
      setCategories(categoriesArray);
      setCategoriesStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryStats = async (categoryId: string) => {
    try {
      const stats = await CategoryService.getCategoryStats(categoryId);
      setCategoriesStats(prev => ({
        ...prev,
        [categoryId]: stats,
      }));
    } catch (err) {
      console.error('Error loading category stats:', err);
    }
  };

  if (loading) {
    return (
      <div className="category-list category-list--loading">
        <div className="category-list__loader">Загрузка категорий...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-list category-list--error">
        <div className="category-list__error">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="category-list">
      <button 
        className="category-list__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
        aria-label={isExpanded ? 'Скрыть категории' : 'Показать категории'}
      >
        <span>Категории</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      <div className={`category-list__items ${isExpanded ? 'category-list__items--expanded' : ''}`}>
        {categories.map(category => (
          <CategoryItem
            key={category.id}
            category={category}
            stats={categoriesStats[category.id]}
            isActive={category.id === activeCategoryId}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;