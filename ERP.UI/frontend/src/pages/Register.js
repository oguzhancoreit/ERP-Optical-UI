import {
  Box, Button, Container, Grid, TextField, Typography,
  MenuItem, Select, InputLabel, FormControl, Divider, Paper,
  Tabs, Tab
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from '../services/axios-instance';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import registerImage from '../assets/logo.png';

function Register() {
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
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

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
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
            <Grid container spacing={2} direction="column">
              {tabIndex === 0 && (
                <>
                  <Grid item>
                    <TextField
                      label="Ad Soyad"
                      name="adminFullName"
                      value={form.adminFullName}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="E-posta"
                      name="adminEmail"
                      value={form.adminEmail}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Şifre"
                      name="adminPassword"
                      type="password"
                      value={form.adminPassword}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Şifre (Tekrar)"
                      name="adminPasswordConfirm"
                      type="password"
                      value={form.adminPasswordConfirm}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                </>
              )}

              {tabIndex === 1 && (
                <>
                  <Grid item>
                    <TextField
                      label="Firma Adı"
                      name="firmName"
                      value={form.firmName}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Vergi Numarası"
                      name="taxNumber"
                      value={form.taxNumber}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Vergi Dairesi"
                      name="taxOffice"
                      value={form.taxOffice}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Adres"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      fullWidth
                    />
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
                </>
              )}

              <Divider sx={{ my: 4 }} />

              <Grid item>
                <TextField
                  label={`Lütfen sonucu girin: ${captcha.question} = ?`}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  Kaydı Tamamla
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
