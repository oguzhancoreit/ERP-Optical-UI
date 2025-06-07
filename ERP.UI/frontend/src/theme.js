import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#6665E6' }, // light ana renk
            secondary: { main: '#9c27b0' },
            background: {
              default: '#f5f5f5',
              paper: '#fff',
            },
            text: {
              primary: '#1a1a1a',
              secondary: '#6e6e6e',
            },
          }
        : {
            primary: { main: '#081A3C' }, // dark ana renk
            secondary: { main: '#ce93d8' },
            background: {
              default: '#061229', // SENİN İSTEDİĞİN DARK ARKA PLAN
              paper: '#102042',
            },
            text: {
              primary: '#fff',
              secondary: '#b0bec5',
            },
          }),
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      button: { textTransform: 'none' },
    },
    components: {
      MuiDataGrid: {
        styleOverrides: {
          columnHeaders: {
            backgroundColor: 'inherit',
          },
          columnHeaderTitle: ({ theme }) => ({
            fontWeight: 700,
            color:
              theme.palette.mode === 'dark'
                ? '#e0edff'
                : '#171826',
          }),
        },
      },
    },
  });

export default getTheme;
