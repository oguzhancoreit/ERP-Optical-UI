import {
  Box, Typography, Paper, Grid, Avatar, CircularProgress, Chip,
  IconButton, Button
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from '../services/axios-instance';
import SidebarLayout from '../layouts/SidebarLayout';

import BusinessIcon from '@mui/icons-material/Business';
import StorageIcon from '@mui/icons-material/Storage';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import SettingsIcon from '@mui/icons-material/Settings';
import UpgradeIcon from '@mui/icons-material/Upgrade';

function Me({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => alert('Kullanıcı bilgisi alınamadı'));
  }, []);

  if (!user) return <Typography align="center">Yükleniyor...</Typography>;

  const packageLabels = {
    basic: 'Basic (1-3 şube)',
    pro: 'Pro (4-10 şube)',
    enterprise: 'Enterprise (10+ şube)',
  };

  const remainingDays = user.packageValidUntil
    ? Math.max(0, Math.ceil((new Date(user.packageValidUntil) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const progressValue = remainingDays
    ? Math.min(100, Math.floor((remainingDays / 1000) * 100))
    : 0;

  const statusColor =
    remainingDays <= 0 ? 'error' :
    remainingDays < 7 ? 'warning' :
    'success';

  return (
    <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <Box sx={{ p: 4 }}>

        {/* Kullanıcı Kartı */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar>
              <WorkspacePremiumIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{user.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </Box>
          </Box>
          <IconButton>
            <SettingsIcon />
          </IconButton>
        </Paper>

        {/* Bilgi Kartları */}
        <Grid container spacing={3}>
          <InfoCard icon={<BusinessIcon />} label="Firma" value={user.firmName} />
          <InfoCard icon={<StorageIcon />} label="Veritabanı" value={user.dbName} />
          <InfoCard icon={<WorkspacePremiumIcon />} label="Paket" value={packageLabels[user.package]}>
            <Chip label={user.package.toUpperCase()} color="primary" size="small" />
          </InfoCard>
          <InfoCard icon={<GroupWorkIcon />} label="Maksimum Şube" value={user.maxBranches} />

          {user.packageValidUntil && (
            <InfoCard icon={<CalendarMonthIcon />} label="Paket Bitiş">
              <Typography>
                {new Date(user.packageValidUntil).toLocaleDateString('tr-TR')}
              </Typography>
            </InfoCard>
          )}

          {remainingDays !== null && (
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={progressValue}
                    size={80}
                    thickness={5}
                    color={statusColor}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {remainingDays}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Kalan Gün
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {remainingDays <= 0 ? 'Süre Doldu' : `${remainingDays} gün`}
                  </Typography>
                  <Chip
                    label={
                      remainingDays <= 0
                        ? 'Pasif'
                        : remainingDays < 7
                        ? 'Yenileme Zamanı'
                        : 'Aktif'
                    }
                    color={statusColor}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Yükseltme Kartı */}
          <Grid item xs={12} sm={6}>
            <Paper
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 2,
                border: '1px dashed',
                borderColor: 'primary.main',
              }}
            >
              <Avatar>
                <WorkspacePremiumIcon />
              </Avatar>
              <Typography variant="h6">
                İhtiyacınız olan özellikler burada mı bitiyor?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Üst paketlerle daha fazla şube ve kullanıcıya erişin. Gelişmiş raporlamalar ve destek sizi bekliyor.
              </Typography>
              <Button
                variant="contained"
                endIcon={<UpgradeIcon />}
                onClick={() => alert('Paket yükseltme sayfasına yönlendirilecek.')}
              >
                Paketi Yükselt
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </SidebarLayout>
  );
}

function InfoCard({ icon, label, value, children }) {
  return (
    <Grid item xs={12} sm={6}>
      <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar>{icon}</Avatar>
        <Box>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          {value !== undefined ? (
            <Typography variant="body1" fontWeight={500}>{value}</Typography>
          ) : children}
        </Box>
      </Paper>
    </Grid>
  );
}

export default Me;
