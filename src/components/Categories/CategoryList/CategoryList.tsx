import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CategoryItem from '../CategoryItem/CategoryItem';
import CategoryService from '@services/CategoryService';
import type { Category, CategoryStats } from '@/types';
import './CategoryList.scss';

const CategoryList: React.FC = () => {
  const { id: activeCategoryId } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesStats, setCategoriesStats] = useState<Record<string, CategoryStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

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

  const handleCategoryComplete = (categoryId: string) => {
    const isCompleted = CategoryService.toggleCategoryComplete(categoryId);
    setCategoriesStats(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        isCompleted,
      },
    }));
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
      <h2 className="category-list__title">Категории</h2>
      <div className="category-list__items">
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