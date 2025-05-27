import {
  AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Avatar, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../services/axios-instance';

const appBarHeight = 56;

function AppHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    axios.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('dbName');
    navigate('/login');
  };

  const getInitials = (name) =>
    name ? name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <AppBar
      position="fixed" // ✅ Sabitlendi
      sx={{
        backgroundColor: '#1976d2',
        height: appBarHeight,
        zIndex: (theme) => theme.zIndex.drawer + 1, // ✅ Drawer üstünde kalsın
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: '56px !important', px: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ flexGrow: 1 }}>
          {user?.firmName || 'NET ERP'}
        </Typography>

        {user && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">{user.fullName}</Typography>

            <Tooltip title="Menü">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
                <Avatar sx={{ width: 30, height: 30, bgcolor: '#fff', color: '#1976d2', fontSize: 14 }}>
                  {getInitials(user.fullName)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => alert('Profil')}>Profil</MenuItem>
              <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
export const APP_BAR_HEIGHT = appBarHeight; // ⬅️ dışa aktarıyoruz
