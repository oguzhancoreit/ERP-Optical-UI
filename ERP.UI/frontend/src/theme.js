// Güncellenmiş Material UI 5 Theme (Material Design 3 uyumlu)
import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#1976d2' }, // Material Blue
            secondary: { main: '#9c27b0' }, // Material Purple
            background: {
              default: '#f5f5f5', // Soft gray
              paper: '#ffffff',
            },
            text: {
              primary: '#212121', // Strong dark
              secondary: '#616161',
            },
            divider: '#e0e0e0',
          }
        : {
            primary: { main: '#90caf9' },
            secondary: { main: '#ce93d8' },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
              secondary: '#b0bec5',
            },
            divider: '#424242',
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
            borderRadius: 12,
            backdropFilter: 'blur(6px)',
            backgroundColor: mode === 'light' ? '#ffffffee' : '#1e1e1ecc',
            boxShadow:
              mode === 'light'
                ? '0 4px 20px rgba(0,0,0,0.08)'
                : '0 4px 20px rgba(0,0,0,0.5)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            padding: '10px 20px',
            boxShadow:
              mode === 'light'
                ? '0 2px 10px rgba(25, 118, 210, 0.15)'
                : '0 2px 10px rgba(144, 202, 249, 0.25)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              borderRadius: 8,
              backgroundColor: mode === 'light' ? '#ffffff' : '#1a1a1a',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#e0e0e0' : '#424242',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#90caf9' : '#64b5f6',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#1976d2' : '#90caf9',
              borderWidth: 2,
            },
          },
        },
      },
    },
  });

export default getTheme;
