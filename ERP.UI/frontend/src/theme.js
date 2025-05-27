// Güncellenmiş theme.js dosyası
import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#0d47a1' },
            background: {
              default: '#e3f2fd',
              paper: '#ffffffcc',
            },
            text: {
              primary: '#0d1b2a',
              secondary: '#37517e',
            },
            divider: '#bbdefb',
          }
        : {
            primary: { main: '#90caf9' },
            background: {
              default: '#0d1b2a',
              paper: '#1e3a5f',
            },
            text: {
              primary: '#ffffff',
              secondary: '#bbdefb',
            },
            divider: '#2e3b55',
          }),
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      button: { textTransform: 'none' },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backdropFilter: 'blur(10px)',
            backgroundColor: mode === 'light' ? '#ffffffdd' : '#1e3a5fcc',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 600,
            padding: '10px 20px',
            boxShadow: '0 4px 20px rgba(13, 71, 161, 0.3)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '& .MuiInputBase-root': {
              backgroundColor: mode === 'light' ? '#ffffff' : '#0d1b2a',
            },
          },
        },
      },
    },
  });

export default getTheme;
