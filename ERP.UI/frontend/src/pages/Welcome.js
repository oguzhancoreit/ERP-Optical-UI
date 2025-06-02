// src/pages/Welcome.js
import {
  Box, Button, Container, Stack, Typography, useTheme
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/welcome-bg.png';

function Welcome() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 0 }, // mobile'de kenarlardan boşluk
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          bgcolor: theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.85)'
            : 'rgba(25, 39, 62, 0.92)',
          p: { xs: 2, sm: 5 },
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: 5,
          color: theme.palette.text.primary,
          width: '100%',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          color="primary"
          fontWeight="bold"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            mt: { xs: 1, sm: 0 },
          }}
        >
          ERP Sistemine Hoş Geldiniz
        </Typography>

        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem' }
          }}
        >
          Lütfen giriş yapın veya yeni bir firma kaydı oluşturun.
        </Typography>

        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="center"
          mt={4}
        >
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            size="large"
            fullWidth
          >
            Giriş Yap
          </Button>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/register')}
            size="large"
            fullWidth
          >
            Kayıt Ol
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default Welcome;
