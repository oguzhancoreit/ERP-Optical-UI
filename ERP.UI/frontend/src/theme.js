// src/theme.js
import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#1976d2',
            },
            background: {
              default: '#f7f9fc',
              paper: '#ffffff',
            },
            text: {
              primary: '#1a1a1a',
              secondary: '#555',
            },
          }
        : {
            primary: {
              main: '#ffffff', // yazı ve ikonlar açık görünür
            },
            background: {
              default: '#19273E', // tüm arka plan
              paper: '#19273E',   // kartlar, drawer vs
            },
            text: {
              primary: '#ffffff',
              secondary: '#cfd8dc',
            },
            divider: '#2e3b55',
          }),
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });

export default getTheme;
