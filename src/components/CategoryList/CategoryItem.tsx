import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Star, CheckCircle, Flame } from 'lucide-react';
import type { Category, CategoryStats } from '@types';

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
    <Box>
      <Card 
        onClick={handleCategoryClick}
        sx={{ 
          cursor: 'pointer',
          border: isActive ? 2 : 0,
          borderColor: 'primary.main',
          bgcolor: stats.isCompleted ? 'success.dark' : 'grey.800',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="subtitle1">
            {category.name}
          </Typography>
        </CardContent>
      </Card>
      
      <Box display="flex" justifyContent="flex-end" gap={2} mt={1} mr={1} flexWrap="wrap">
        {stats.favorites > 0 && (
          <Typography
            component={Link}
            to={`/category/${category.id}/favorites`}
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'none', '&:hover': { color: 'warning.main' } }}
          >
            избранное ({stats.favorites})
          </Typography>
        )}
        {stats.known > 0 && (
          <Typography
            component={Link}
            to={`/category/${category.id}/known`}
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'none', '&:hover': { color: 'success.main' } }}
          >
            знаю ({stats.known})
          </Typography>
        )}
        {stats.hard > 0 && (
          <Typography
            component={Link}
            to={`/category/${category.id}/hard`}
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'none', '&:hover': { color: 'error.main' } }}
          >
            сложные ({stats.hard})
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CategoryItem;