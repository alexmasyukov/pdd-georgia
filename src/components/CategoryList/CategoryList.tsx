import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CategoryItem from './CategoryItem';
import CategoryService from '@services/CategoryService';
import type { Category, CategoryStats } from '@types';
import './CategoryList.scss';

const CategoryList: React.FC = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryStats, setCategoryStats] = useState<Map<number, CategoryStats>>(new Map());
  const activeCategoryId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const allCategories = CategoryService.getAllCategories();
    const stats = CategoryService.getAllCategoryStats();
    setCategories(allCategories);
    setCategoryStats(stats);
  };

  // Обновляем статистику при изменении localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const stats = CategoryService.getAllCategoryStats();
      setCategoryStats(stats);
    };

    window.addEventListener('storage', handleStorageChange);
    // Также слушаем кастомное событие для обновления в той же вкладке
    window.addEventListener('localStorageUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleStorageChange);
    };
  }, []);

  return (
    <Box className="category-list">
      <Typography variant="h5" className="category-list__title">
        Категории
      </Typography>
      
      <Box className="category-list__items">
        {categories.map(category => {
          const stats = categoryStats.get(category.id) || {
            total: 0,
            favorites: 0,
            known: 0,
            hard: 0,
            isCompleted: false
          };
          
          return (
            <CategoryItem
              key={category.id}
              category={category}
              stats={stats}
              isActive={category.id === activeCategoryId}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default CategoryList;