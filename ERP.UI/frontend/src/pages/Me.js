import {
  Box, Typography, Stack, Divider, useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from '../services/axios-instance';
import SidebarLayout from '../layouts/SidebarLayout';

function Me({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    axios.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => alert('Kullanıcı bilgisi alınamadı'));
  }, []);

  if (!user) return <Typography align="center">Yükleniyor...</Typography>;

  return (
    <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 100px)',
          px: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            p: 5,
            borderRadius: 2,
            maxWidth: 500,
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2],
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Kullanıcı Künyesi
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Ad Soyad
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.fullName}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                E-posta
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.email}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Firma
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.firmName}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Veritabanı
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {user.dbName}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="caption" color="text.secondary">
            Bu bilgiler aktif kullanıcıya aittir.
          </Typography>
        </Box>
      </Box>
    </SidebarLayout>
  );
}

export default Me;
