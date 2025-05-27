import {
  Box, Button, Container, TextField, Typography, Paper,
  Checkbox, FormControlLabel, Link, useTheme
} from '@mui/material';
import { useState } from 'react';
import axios from '../services/axios-instance';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../assets/login.png';

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
      if (rememberMe) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('dbName', res.data.dbName);
      } else {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('dbName', res.data.dbName);
      }
      navigate('/me');
    } catch (err) {
      alert('Giriş başarısız!');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Görsel */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: theme.palette.mode === 'light' ? '#f0f6fb' : '#1b2b3e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
            }}
          >
            <img
              src={LoginImage}
              alt="Login"
              style={{
                width: '100%',
                maxWidth: 300,
                borderRadius: '16px',
                objectFit: 'cover',
              }}
            />
          </Box>

          {/* Form Alanı */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flex: 1,
              p: 5,
              backgroundColor: theme.palette.background.paper,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h5" color="primary" fontWeight="bold" align="center" gutterBottom>
              Net Gör, Net Yönet
            </Typography>

            <Typography variant="h4" align="center" gutterBottom>
              Core Optical
            </Typography>

            <TextField
              label="E-posta"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              sx={{ my: 2 }}
            />
            <TextField
              label="Şifre"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 1 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Beni hatırla"
              sx={{ mb: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.3,
                fontSize: '1rem',
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark || '#155aaf',
                },
              }}
            >
              Giriş Yap
            </Button>

            <Box textAlign="center" mt={2}>
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
    </Box>
  );
}

export default Login;
