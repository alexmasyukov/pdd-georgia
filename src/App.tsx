import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
import AppRouter from '@/router';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  // components: {
  //   MuiCard: {
  //     styleOverrides: {
  //       root: {
  //         backgroundColor: '#1e1e1e',
  //         backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
  //       },
  //     },
  //   },
  //   MuiButton: {
  //     styleOverrides: {
  //       outlined: {
  //         borderColor: 'rgba(255, 255, 255, 0.23)',
  //         '&:hover': {
  //           borderColor: '#1976d2',
  //           backgroundColor: 'rgba(25, 118, 210, 0.08)',
  //         },
  //       },
  //     },
  //   },
  //   MuiDrawer: {
  //     styleOverrides: {
  //       paper: {
  //         backgroundColor: '#1e1e1e',
  //         backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
  //       },
  //     },
  //   },
  // },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/*<CssBaseline />*/}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
