import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#0D47A1' },
            secondary: { main: '#9c27b0' },
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
            text: {
              primary: '#212121',
              secondary: '#616161',
            },
            divider: '#0D47A1',
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
            divider: '#1F1F1F',
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
        defaultProps: {
          variant: 'outlined',
          fullWidth: true,
        },
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
            '& input::placeholder': {
              opacity: 1,
            },
          },
        },
      },
    },
  });

export default getTheme;
