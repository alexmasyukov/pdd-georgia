import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Home, Star, CheckCircle, Flame } from 'lucide-react';
import './Header.scss';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" className="header" elevation={0}>
      <Toolbar className="header__toolbar">
        <Typography variant="h6" className="header__title">
          ПДД Грузии - Тестирование
        </Typography>
        
        <Box className="header__nav">
          <Button
            component={Link}
            to="/"
            startIcon={<Home size={18} />}
            className={`header__nav-item ${isActive('/') ? 'active' : ''}`}
            color="inherit"
          >
            Главная
          </Button>
          
          <Button
            component={Link}
            to="/favorites"
            startIcon={<Star size={18} />}
            className={`header__nav-item ${isActive('/favorites') ? 'active' : ''}`}
            color="inherit"
          >
            Избранное
          </Button>
          
          <Button
            component={Link}
            to="/known"
            startIcon={<CheckCircle size={18} />}
            className={`header__nav-item ${isActive('/known') ? 'active' : ''}`}
            color="inherit"
          >
            Точно знаю
          </Button>
          
          <Button
            component={Link}
            to="/hard"
            startIcon={<Flame size={18} />}
            className={`header__nav-item ${isActive('/hard') ? 'active' : ''}`}
            color="inherit"
          >
            Сложные
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;