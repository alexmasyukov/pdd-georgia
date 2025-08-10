import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {AppBar, Box, Button, Toolbar, Typography} from '@mui/material';
import {CheckCircle, Flame, Home, Star} from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{flexGrow: 0, mr: 4}}>
          ПДД Грузии - Тестирование
        </Typography>

        <Box sx={{display: 'flex', gap: 1}}>
          <Button
            component={Link}
            to="/"
            startIcon={<Home size={18}/>}
            color="inherit"
            sx={{
              backgroundColor: isActive('/') ? 'primary.dark' : 'transparent',
              '&:hover': {backgroundColor: 'primary.dark'}
            }}
          >
            Главная
          </Button>

          <Button
            component={Link}
            to="/favorites"
            startIcon={<Star size={18}/>}
            color="inherit"
            sx={{
              backgroundColor: isActive('/favorites') ? 'primary.dark' : 'transparent',
              '&:hover': {backgroundColor: 'primary.dark'}
            }}
          >
            Избранное
          </Button>

          <Button
            component={Link}
            to="/known"
            startIcon={<CheckCircle size={18}/>}
            color="inherit"
            sx={{
              backgroundColor: isActive('/known') ? 'primary.dark' : 'transparent',
              '&:hover': {backgroundColor: 'primary.dark'}
            }}
          >
            Точно знаю
          </Button>

          <Button
            component={Link}
            to="/hard"
            startIcon={<Flame size={18}/>}
            color="inherit"
            sx={{
              backgroundColor: isActive('/hard') ? 'primary.dark' : 'transparent',
              '&:hover': {backgroundColor: 'primary.dark'}
            }}
          >
            Сложные
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;