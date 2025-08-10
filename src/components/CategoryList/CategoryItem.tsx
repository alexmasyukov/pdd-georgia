import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Star, CheckCircle, Flame } from 'lucide-react';
import type { Category, CategoryStats } from '@types';
import './CategoryList.scss';

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
    <Card 
      className={`category-item ${stats.isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
      onClick={handleCategoryClick}
    >
      <CardContent className="category-item__content">
        <Typography variant="h6" className="category-item__title">
          {category.name}
        </Typography>
        
        <Typography variant="body2" className="category-item__total">
          Всего вопросов: {stats.total}
        </Typography>
        
        <Box className="category-item__stats">
          {stats.favorites > 0 && (
            <Link 
              to={`/category/${category.id}/favorites`}
              className="category-item__stat-link"
              onClick={(e) => e.stopPropagation()}
            >
              <Star size={16} />
              <span>{stats.favorites}</span>
            </Link>
          )}
          
          {stats.known > 0 && (
            <Link 
              to={`/category/${category.id}/known`}
              className="category-item__stat-link"
              onClick={(e) => e.stopPropagation()}
            >
              <CheckCircle size={16} />
              <span>{stats.known}</span>
            </Link>
          )}
          
          {stats.hard > 0 && (
            <Link 
              to={`/category/${category.id}/hard`}
              className="category-item__stat-link"
              onClick={(e) => e.stopPropagation()}
            >
              <Flame size={16} />
              <span>{stats.hard}</span>
            </Link>
          )}
        </Box>
        
        {stats.isCompleted && (
          <Chip 
            label="Изучено" 
            color="success" 
            size="small" 
            className="category-item__status"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryItem;