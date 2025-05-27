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
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          bgcolor: theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.7)'
            : 'rgba(25, 39, 62, 0.8)',
          p: 5,
          borderRadius: 3,
          boxShadow: 5,
          color: theme.palette.text.primary,
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          color="primary"
          fontWeight="bold"
        >
          ERP Sistemine Hoş Geldiniz
        </Typography>

        <Typography variant="subtitle1" align="center" color="text.secondary">
          Lütfen giriş yapın veya yeni bir firma kaydı oluşturun.
        </Typography>

        <Stack spacing={2} direction="row" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            size="large"
          >
            Giriş Yap
          </Button>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/register')}
            size="large"
          >
            Kayıt Ol
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default Welcome;
