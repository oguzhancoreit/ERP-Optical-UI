import {
  Box, Typography, useTheme, Paper, Grid, Avatar, CircularProgress, Chip,
  Tooltip, IconButton, Button
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

  if (!user) return <Typography align="center">Yükleniyor...</Typography>;

  const packageLabels = {
    basic: 'Basic (1-3 şube)',
    pro: 'Pro (4-10 şube)',
    enterprise: 'Enterprise (10+ şube)',
  };

  const remainingDays = user.packageValidUntil
    ? Math.max(0, Math.ceil((new Date(user.packageValidUntil) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const totalDays = 1000;
  const progressValue = remainingDays
    ? Math.min(100, Math.floor((remainingDays / totalDays) * 100))
    : 0;

  const statusColor =
    remainingDays <= 0 ? 'error' :
    remainingDays < 7 ? 'warning' :
    'success';

  const gradientCard = theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a2a3f, #22334d)'
    : 'linear-gradient(135deg, #f0f4ff, #e2eaff)';

  return (
    <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <Box sx={{ p: 4, backgroundColor: theme.palette.background.default }}>

        {/* Kullanıcı Kartı */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            background: gradientCard,
            boxShadow: theme.shadows[3],
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, color: '#fff', width: 56, height: 56 }}>
              <WorkspacePremiumIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {user.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <IconButton sx={{ color: theme.palette.text.secondary }}>
            <SettingsIcon />
          </IconButton>
        </Paper>

        {/* Bilgi Kartları */}
        <Grid container spacing={3}>
          <InfoCard
            icon={<BusinessIcon />}
            label="Firma"
            value={user.firmName}
            iconColor={theme.palette.info.main}
          />
          <InfoCard
            icon={<StorageIcon />}
            label="Veritabanı"
            value={user.dbName}
            iconColor={theme.palette.secondary.main}
          />
          <InfoCard
            icon={<WorkspacePremiumIcon />}
            label="Paket"
            value={packageLabels[user.package]}
            iconColor={theme.palette.warning.main}
          >
            <Chip label={user.package.toUpperCase()} color="primary" size="small" />
          </InfoCard>
          <InfoCard
            icon={<GroupWorkIcon />}
            label="Maksimum Şube"
            value={user.maxBranches}
            iconColor={theme.palette.success.main}
          />
          {user.packageValidUntil && (
            <InfoCard
              icon={<CalendarMonthIcon />}
              label="Paket Bitiş"
              iconColor={theme.palette.error.main}
            >
              <Typography>
                {new Date(user.packageValidUntil).toLocaleDateString('tr-TR')}
              </Typography>
            </InfoCard>
          )}

          {/* Kalan Gün Kartı */}
          {remainingDays !== null && (
            <Grid item xs={12} sm={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: theme.shadows[2],
                }}
              >
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
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {remainingDays}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">Kalan Gün</Typography>
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

          {/* Geliştirilmiş Yükseltme Kartı */}
          <Grid item xs={12} sm={6}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #263245, #1a2538)'
                  : 'linear-gradient(135deg, #e3f2fd, #ffffff)',
                border: `1px dashed ${theme.palette.primary.main}`,
                boxShadow: theme.shadows[2],
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: '#fff',
                  width: 56,
                  height: 56,
                  mb: 1,
                }}
              >
                <WorkspacePremiumIcon />
              </Avatar>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                İhtiyacınız olan özellikler burada mı bitiyor?
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Üst paketlerle daha fazla şube ve kullanıcıya erişin. İleri düzey raporlamalar ve destek sizleri bekliyor.
              </Typography>

              <Button
                variant="contained"
                color="primary"
                size="medium"
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

function InfoCard({ icon, label, value, children, iconColor }) {
  const theme = useTheme();
  return (
    <Grid item xs={12} sm={6}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          height: '100%',
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
        }}
      >
        <Avatar sx={{ bgcolor: iconColor || theme.palette.primary.light, color: '#fff' }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          {value !== undefined ? (
            <Typography variant="body1" fontWeight={500}>
              {value}
            </Typography>
          ) : (
            children
          )}
        </Box>
      </Paper>
    </Grid>
  );
}

export default Me;
