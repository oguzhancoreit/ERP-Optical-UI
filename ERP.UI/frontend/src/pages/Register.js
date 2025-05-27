import {
  Box, Button, Container, Grid, TextField, Typography,
  MenuItem, Select, InputLabel, FormControl, Divider, Paper,
  Tabs, Tab, useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from '../services/axios-instance';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import registerImage from '../assets/logo.png';

function Register() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [captchaInput, setCaptchaInput] = useState('');

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10 + 1);
    const b = Math.floor(Math.random() * 10 + 1);
    const operator = Math.random() > 0.5 ? '+' : '-';
    const question = `${a} ${operator} ${b}`;
    const answer = eval(question);
    return { question, answer };
  };

  const [captcha, setCaptcha] = useState(generateCaptcha());

  const [form, setForm] = useState({
    firmName: '', taxNumber: '', taxOffice: '', address: '',
    countryId: '', cityId: '', adminFullName: '', adminEmail: '',
    adminPassword: '', adminPasswordConfirm: '',
  });

  useEffect(() => {
    axios.get('/countries').then(res => setCountries(res.data));
  }, []);

  useEffect(() => {
    if (form.countryId) {
      axios.get(`/cities/${form.countryId}`).then(res => {
        setCities(res.data);
        setForm(prev => ({ ...prev, cityId: '' }));
      });
    }
  }, [form.countryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.adminPassword !== form.adminPasswordConfirm) {
      alert('Şifreler uyuşmuyor!');
      setTabIndex(0);
      return;
    }

    if (parseInt(captchaInput) !== captcha.answer) {
      alert('Captcha yanlış. Lütfen doğru cevabı girin.');
      setCaptcha(generateCaptcha());
      return;
    }

    try {
      await axios.post('/firms/register', form);
      const loginRes = await axios.post('/auth/login', {
        email: form.adminEmail,
        password: form.adminPassword,
      });

      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('dbName', loginRes.data.dbName);
      navigate('/me');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Kayıt başarısız!');
    }
  };

  const textFieldSx = {
    '& .MuiInputBase-root': {
      backgroundColor: theme.palette.mode === 'light' ? '#ffffffcc' : '#10253d',
      borderRadius: 2,
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
      color: theme.palette.mode === 'light' ? theme.palette.text.primary : theme.palette.text.secondary,
    },
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
      <Container maxWidth="sm">
        <Box textAlign="center" mb={4}>
          <img
            src={registerImage}
            alt="Kayıt Ol"
            style={{ maxWidth: '120px', width: '100%' }}
          />
          <Typography variant="h4" mt={2} fontWeight="bold">
            Hızlı Kayıt
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sisteme erişebilmeniz için önce firma ve admin bilgilerini girin.
          </Typography>
        </Box>

        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[8],
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: theme.shadows[12],
            },
            transform: 'scale(0.95)',
            animation: 'zoomIn 0.8s ease forwards',
          }}
        >
          <Typography variant="h5" gutterBottom align="center">
            Firma & Kullanıcı Kaydı
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            centered
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Admin Kullanıcı" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Firma Bilgileri" icon={<BusinessIcon />} iconPosition="start" />
          </Tabs>

          <form onSubmit={handleSubmit}>
            {tabIndex === 0 && (
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <TextField label="Ad Soyad" name="adminFullName" value={form.adminFullName} onChange={handleChange} fullWidth required sx={textFieldSx} />
                </Grid>
                <Grid item>
                  <TextField label="E-posta" name="adminEmail" value={form.adminEmail} onChange={handleChange} fullWidth required sx={textFieldSx} />
                </Grid>
                <Grid item>
                  <TextField label="Şifre" name="adminPassword" type="password" value={form.adminPassword} onChange={handleChange} fullWidth required sx={textFieldSx} />
                </Grid>
                <Grid item>
                  <TextField label="Şifre (Tekrar)" name="adminPasswordConfirm" type="password" value={form.adminPasswordConfirm} onChange={handleChange} fullWidth required sx={textFieldSx} />
                </Grid>
              </Grid>
            )}

            {tabIndex === 1 && (
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <TextField label="Firma Adı" name="firmName" value={form.firmName} onChange={handleChange} fullWidth required sx={textFieldSx} />
                </Grid>
                <Grid item>
                  <TextField label="Vergi Numarası" name="taxNumber" value={form.taxNumber} onChange={handleChange} fullWidth sx={textFieldSx} />
                </Grid>
                <Grid item>
                  <TextField label="Vergi Dairesi" name="taxOffice" value={form.taxOffice} onChange={handleChange} fullWidth sx={textFieldSx} />
                </Grid>
                <Grid item>
                  <TextField label="Adres" name="address" value={form.address} onChange={handleChange} fullWidth sx={textFieldSx} />
                </Grid>
                <Grid item>
                  <FormControl fullWidth required>
                    <InputLabel>Ülke</InputLabel>
                    <Select
                      name="countryId"
                      value={form.countryId}
                      onChange={handleChange}
                      label="Ülke"
                    >
                      {countries.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl fullWidth required>
                    <InputLabel>Şehir</InputLabel>
                    <Select
                      name="cityId"
                      value={form.cityId}
                      onChange={handleChange}
                      label="Şehir"
                      disabled={!form.countryId}
                    >
                      {cities.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            <Divider sx={{ my: 4 }} />
            <Grid container spacing={2} direction="column">
              <Grid item>
                <TextField
                  label={`Lütfen sonucu girin: ${captcha.question} = ?`}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  fullWidth
                  required
                  sx={textFieldSx}
                />
              </Grid>
              <Grid item textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ mt: 2, px: 4, py: 1.5 }}
                >
                  Kaydı Tamamla
                </Button>
              </Grid>
            </Grid>
          </form>
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
        `}
      </style>
    </Box>
  );
}

export default Register;