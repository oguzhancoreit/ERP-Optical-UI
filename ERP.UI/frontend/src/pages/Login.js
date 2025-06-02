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
        px: 1,
        animation: 'fadeIn 1.5s ease-in-out',
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 0, sm: 2 } }}>
        <Paper
          elevation={24}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            borderRadius: { xs: 2, sm: 6 },
            overflow: 'hidden',
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            transform: 'scale(0.97)',
            animation: 'zoomIn 0.8s ease forwards',
            mx: { xs: 0, md: 'auto' },
            maxWidth: { xs: '100%', md: 900 }
          }}
        >
          {/* Görsel Alanı - Tam Yuvarlatılmış ve Gölgeyle */}
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
              p: { xs: 2, sm: 4 },
              position: 'relative',
              minHeight: { xs: 180, sm: 'auto' },
              gap: 2,
              width: { xs: '100%', md: 'unset' },
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
            {/* Yuvarlatılmış köşeler ve gölge */}
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 500 }}>
              <img
                src={LoginImage}
                alt="Login"
                style={{
                  width: '100%',
                  borderRadius: 55,
                  objectFit: 'cover',
                  boxShadow: '0 33px 40px rgba(0,0,0,0.5)',
                  zIndex: 1
                }}
              />
              <img
                src={Logo}
                alt="Core Optical Logo"
                style={{
                  position: 'absolute',
                  top: 18,
                  left: 18,
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  padding: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.20)',
                  zIndex: 2
                }}
              />
            </Box>
          </Box>

          {/* Form Alanı */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flex: 1,
              p: { xs: 2, sm: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              animation: 'fadeInUp 1.5s ease',
              minWidth: { xs: '100%', md: 400 }
            }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: 700,
                color: theme.palette.mode === 'light'
                  ? theme.palette.primary.dark
                  : '#fff',
                fontSize: { xs: '1.8rem', sm: '2.3rem' },
                mb: 1.5,
                letterSpacing: 0.2
              }}
              gutterBottom
            >
              Core Optical'a Hoş Geldiniz
            </Typography>

            <Typography
              variant="subtitle1"
              align="center"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                fontSize: { xs: '1.07rem', sm: '1.19rem' },
                mb: 3,
                lineHeight: 1.5
              }}
            >
              <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                Dijital sahneniz burada başlıyor.
              </span>{' '}
              Kullanıcı dostu ve güvenli ERP sistemiyle işinizi geleceğe taşıyın.
            </Typography>

            <TextField
              label="E-posta adresiniz"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                my: 1.2,
                fontWeight: 'medium',
                fontSize: { xs: '0.95rem', sm: '1rem' }
              }}
              size="medium"
              autoComplete="username"
            />
            <TextField
              label="Parolanız"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                mb: 1.2,
                fontWeight: 'medium',
                fontSize: { xs: '0.95rem', sm: '1rem' }
              }}
              size="medium"
              autoComplete="current-password"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: { xs: '0.92rem', sm: '1rem' } }}>
                  Beni hatırla
                </Typography>
              }
              sx={{ mb: 1.5 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: { xs: 1.1, sm: 1.6 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 'bold',
                letterSpacing: 0.5,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                mb: 2
              }}
            >
              Giriş Yap
            </Button>

            <Box textAlign="center" mt={2}>
              <Link href="#" underline="hover" color="primary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                Şifremi mi unuttum?
              </Link>
              <Typography variant="caption" display="block" mt={0.7} color="text.secondary" sx={{
                fontSize: { xs: '0.86rem', sm: '0.92rem' }
              }}>
                Şifrenizi mi unuttunuz? Hiç sorun değil, hemen sıfırlayın!
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
