import {
  Box, Button, Container, TextField, Typography, Paper,
  Checkbox, FormControlLabel, Link, useTheme
} from '@mui/material';
import { useState } from 'react';
import axios from '../services/axios-instance';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../assets/login.png';
import Logo from '../assets/logo.png';

function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', res.data.token);
      storage.setItem('dbName', res.data.dbName);
      navigate('/me');
    } catch (err) {
      alert('Giriş başarısız!');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(145deg, #0d47a1, #1565c0, #1e88e5)'
          : 'linear-gradient(145deg, #0d47a1, #0b3c84, #1565c0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        animation: 'fadeIn 1.5s ease-in-out',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            borderRadius: 6,
            overflow: 'hidden',
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            transform: 'scale(0.95)',
            animation: 'zoomIn 0.8s ease forwards',
          }}
        >
          <Box
            sx={{
              flex: 1,
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(to bottom right, #1e88e5, #1565c0)'
                : 'linear-gradient(to bottom right, #0d47a1, #0b3c84)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              position: 'relative',
              overflow: 'hidden',
              gap: 2
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                background: theme.palette.primary.main,
                animation: 'slideBar 3s ease-in-out infinite',
              }}
            />
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 500 }}>
              <img
                src={LoginImage}
                alt="Login"
                style={{
                  width: '100%',
                  borderRadius: 24,
                  objectFit: 'cover',
                  boxShadow: '0 33px 40px rgba(0,0,0,0.99)',
                  zIndex: 1
                }}
              />
              <img
                src={Logo}
                alt="Core Optical Logo"
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  padding: 5,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 2
                }}
              />
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flex: 1,
              p: { xs: 3, sm: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              animation: 'fadeInUp 1.5s ease',
            }}
          >
            <Typography variant="h4" color="primary" fontWeight="bold" align="center" gutterBottom>
              🕶️ Spotlar Gözlüğünü Parlatıyor, Perde Görüşe Açılıyor!
            </Typography>

            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: theme.palette.mode === 'light' ? theme.palette.primary.dark : '#fff',
              }}
            >
              Core Optical Sahnesine Hoş Geldin
            </Typography>

            <TextField
              label="E-posta adresiniz"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              sx={{ my: 2, fontWeight: 'medium' }}
            />
            <TextField
              label="Parolanız"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2, fontWeight: 'medium' }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label={<Typography variant="body2">Beni hatırla (ışıklar hiç sönmesin!)</Typography>}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.6,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                letterSpacing: 0.5,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Şimdi Sahnene Çık 🚀
            </Button>

            <Box textAlign="center" mt={3}>
              <Link href="#" underline="hover" color="primary">
                Şifremi unuttum / sıfırla
              </Link>
              <Typography variant="caption" display="block" mt={1} color="text.secondary">
                Şifreni unuttuysan ben mi öğreteyim? 🙃
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes zoomIn {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideBar {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </Box>
  );
}

export default Login;