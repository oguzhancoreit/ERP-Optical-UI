import {
  Box, Typography, Paper, Grid, Avatar, CircularProgress, Chip,
  IconButton, Button, Stack, useTheme
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
  const theme = useTheme();

  useEffect(() => {
    axios.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => alert('Kullanıcı bilgisi alınamadı'));
  }, []);

  if (!user) return <Box sx={{ p: 4, minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <CircularProgress size={40} />
  </Box>;

  const packageLabels = {
    basic: 'Basic (1-3 şube)',
    pro: 'Pro (4-10 şube)',
    enterprise: 'Enterprise (10+ şube)',
  };

  const remainingDays = user.packageValidUntil
    ? Math.max(0, Math.ceil((new Date(user.packageValidUntil) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const progressValue = remainingDays !== null
    ? Math.min(100, Math.floor((remainingDays / 1000) * 100))
    : 0;

  const statusColor =
    remainingDays <= 0 ? 'error' :
    remainingDays < 7 ? 'warning' :
    'success';

  return (
    <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1050, mx: 'auto' }}>
        {/* Kullanıcı Kartı */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              width: 56,
              height: 56,
              fontSize: 32
            }}>
              <WorkspacePremiumIcon fontSize="inherit" />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </Box>
          </Stack>
          <IconButton size="large" color="primary" sx={{ ml: { xs: 0, sm: 2 } }}>
            <SettingsIcon fontSize="medium" />
          </IconButton>
        </Paper>

        {/* Bilgi Kartları */}
        <Grid container spacing={3}>
          <InfoCard icon={<BusinessIcon />} label="Firma" value={user.firmName} />
          <InfoCard icon={<StorageIcon />} label="Veritabanı" value={user.dbName} />
          <InfoCard icon={<WorkspacePremiumIcon />} label="Paket" value={packageLabels[user.package]}>
            <Chip label={user.package?.toUpperCase()} color="primary" size="small" sx={{ mt: 0.5 }} />
          </InfoCard>
          <InfoCard icon={<GroupWorkIcon />} label="Maksimum Şube" value={user.maxBranches} />

          {user.packageValidUntil && (
            <InfoCard icon={<CalendarMonthIcon />} label="Paket Bitiş">
              <Typography variant="body2" fontWeight={500}>
                {new Date(user.packageValidUntil).toLocaleDateString('tr-TR')}
              </Typography>
            </InfoCard>
          )}

          {remainingDays !== null && (
            <Grid item xs={12} sm={6}>
              <Paper sx={{
                p: 3, display: 'flex', alignItems: 'center', gap: 3,
                minHeight: 120, borderRadius: 2, boxShadow: 1
              }}>
                <Box sx={{ position: 'relative', display: 'inline-flex', minWidth: 80 }}>
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
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 15 }}>
                    Kalan Gün
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5 }}>
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
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 2,
                border: '1.5px dashed',
                borderColor: 'primary.main',
                minHeight: 210,
                borderRadius: 2,
                boxShadow: 0
              }}
            >
              <Avatar sx={{
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                width: 52, height: 52, mb: 1
              }}>
                <WorkspacePremiumIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">
                İhtiyacınız olan özellikler burada mı bitiyor?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Üst paketlerle daha fazla şube ve kullanıcıya erişin. Gelişmiş raporlamalar ve destek sizi bekliyor.
              </Typography>
              <Button
                variant="contained"
                endIcon={<UpgradeIcon />}
                onClick={() => alert('Paket yükseltme sayfasına yönlendirilecek.')}
                size="large"
                sx={{ fontWeight: 'bold', minWidth: 180 }}
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
    <Grid item xs={12} sm={6} md={4}>
      <Paper
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minHeight: 90,
          borderRadius: 2,
          boxShadow: 0.5
        }}
      >
        <Avatar sx={{ bgcolor: 'background.paper', color: 'primary.main' }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 15 }}>
            {label}
          </Typography>
          {value !== undefined ? (
            <Typography variant="body1" fontWeight={500} sx={{ mt: 0.2 }}>{value}</Typography>
          ) : children}
        </Box>
      </Paper>
    </Grid>
  );
}

export default Me;
