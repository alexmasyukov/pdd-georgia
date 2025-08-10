import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Drawer, Toolbar } from '@mui/material';

interface LayoutProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ sidebar, header }) => {
  const sidebarWidth = 320;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {header && (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            {header}
          </Toolbar>
        </AppBar>
      )}
      {sidebar && (
        <Drawer
          variant="permanent"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: sidebarWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            {sidebar}
          </Box>
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ...(header && { mt: 8 }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;