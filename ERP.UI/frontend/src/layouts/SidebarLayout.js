import {
  Box, CssBaseline, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, AppBar, Typography,
  IconButton, Collapse, useTheme, Tooltip, Divider, TextField, InputAdornment
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useMemo, useEffect, useRef } from 'react';
import React from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';

import logo from '../assets/gozluk.png';

const expandedDrawerWidth = 240;
const collapsedDrawerWidth = 72;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon sx={{ color: '#1976d2' }} />,
    path: '/me',
  },
  {
    text: 'Yönetim',
    icon: <PeopleIcon sx={{ color: '#9c27b0' }} />,
    children: [
      {
        text: 'Kullanıcılar',
        path: '/users',
        icon: <AccountCircleIcon sx={{ color: '#4caf50', fontSize: 18 }} />,
      },
      {
        text: 'Roller',
        path: '/roles',
        icon: <SecurityIcon sx={{ color: '#ff9800', fontSize: 18 }} />,
      },
      {
        text: 'Şubeler',
        path: '/branchs',
        icon: <BusinessIcon sx={{ color: '#e91e63', fontSize: 18 }} />,
      },
    ],
  },
  {
    text: 'Ayarlar',
    icon: <SettingsIcon sx={{ color: '#ff5722' }} />,
    path: '/settings',
  },
];

function filterMenu(items, search) {
  if (!search) return items;
  const term = search.toLowerCase();
  return items
    .map(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(child => child.text.toLowerCase().includes(term));
        if (filteredChildren.length) return { ...item, children: filteredChildren };
        if (item.text.toLowerCase().includes(term)) return item;
        return null;
      }
      return item.text.toLowerCase().includes(term) ? item : null;
    })
    .filter(Boolean);
}

export default function SidebarLayout({
  children,
  darkMode = false,
  setDarkMode = () => {},
  currentUser
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [openMenus, setOpenMenus] = useState({});
  const didAutoExpand = useRef(false); // <-- önemli kısım

  const drawerWidth = drawerOpen ? expandedDrawerWidth : collapsedDrawerWidth;

  const filteredMenuItems = useMemo(() => filterMenu(menuItems, search), [search]);

  // Sadece ilk açılışta aktif parent menüyü expand yap!
  useEffect(() => {
    if (didAutoExpand.current) return;
    menuItems.forEach(item => {
      if (
        item.children &&
        item.children.some(child => location.pathname.startsWith(child.path))
      ) {
        setOpenMenus(prev => ({ ...prev, [item.text]: true }));
      }
    });
    didAutoExpand.current = true;
    // eslint-disable-next-line
  }, []);

  // Parent menüleri elle açıp kapama
  const toggleSubMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Sidebar Drawer Component
  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar
        sx={{
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: drawerOpen ? 'flex-start' : 'center',
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Logo"
          onClick={() => navigate('/')}
          sx={{
            height: 45,
            mr: drawerOpen ? 1 : 0,
            transition: 'margin 0.3s',
            cursor: 'pointer',
          }}
        />
        {drawerOpen && (
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Core Optical
          </Typography>
        )}
      </Toolbar>

      {/* Sidebar Search */}
      <Box px={drawerOpen ? 2 : 1} pb={1} pt={drawerOpen ? 0 : 2}>
        <TextField
          fullWidth
          size="small"
          placeholder="Menüde ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'inherit', fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            display: drawerOpen ? 'block' : 'none',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
          }}
        />
      </Box>

      <Divider sx={{ mb: 1, display: drawerOpen ? 'block' : 'none' }} />

      <List disablePadding sx={{ flexGrow: 1 }}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isChildActive =
            item.children && item.children.some(child => location.pathname.startsWith(child.path));
          return (
            <Box key={item.text}>
              <ListItem disablePadding>
                <Tooltip title={item.text} placement="right" disableHoverListener={drawerOpen}>
                  <ListItemButton
                    onClick={() => {
                      if (item.children) {
                        toggleSubMenu(item.text);
                      } else if (item.path) {
                        navigate(item.path);
                      }
                    }}
                    selected={isActive || isChildActive}
                    sx={{ px: 3 }}
                  >
                    <ListItemIcon sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 2 : 'auto',
                      justifyContent: 'center',
                      color: 'inherit'
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {drawerOpen && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ sx: { color: 'inherit' } }}
                      />
                    )}
                    {item.children && drawerOpen && (
                      openMenus[item.text]
                        ? <ExpandLess />
                        : <ExpandMore />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>

              {item.children && (
                <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {item.children.map((child) => {
                      const isChildRouteActive = location.pathname === child.path;
                      return (
                        <ListItem key={child.text} disablePadding>
                          <Tooltip title={child.text} placement="right" disableHoverListener={drawerOpen}>
                            <ListItemButton
                              onClick={e => {
                                e.stopPropagation();
                                navigate(child.path);
                              }}
                              selected={isChildRouteActive}
                              sx={{
                                pl: drawerOpen ? 6 : 3,
                                py: 0.5,
                                minHeight: 36,
                                backgroundColor: isChildRouteActive
                                  ? theme.palette.action.selected
                                  : 'transparent',
                                '&:hover': {
                                  backgroundColor: theme.palette.action.hover,
                                }
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 28,
                                  color: 'inherit',
                                  fontSize: 18,
                                }}
                              >
                                {child.icon}
                              </ListItemIcon>
                              {drawerOpen && (
                                <ListItemText
                                  primary={child.text}
                                  primaryTypographyProps={{
                                    sx: {
                                      color: 'inherit',
                                      fontSize: 14,
                                      fontWeight: 400,
                                    }
                                  }}
                                />
                              )}
                            </ListItemButton>
                          </Tooltip>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Alt sabit bölüm: Ayarlar ve Çıkış */}
      <Box>
        <List disablePadding>
          <ListItem disablePadding>
            <Tooltip title="Ayarlar" placement="right" disableHoverListener={drawerOpen}>
              <ListItemButton
                onClick={() => navigate('/settings')}
                selected={location.pathname === '/settings'}
                sx={{ px: 3 }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 2 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                  <SettingsIcon sx={{ color: '#ff5722' }} />
                </ListItemIcon>
                {drawerOpen && (
                  <ListItemText primary="Ayarlar" primaryTypographyProps={{ sx: { color: 'inherit' } }} />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding>
            <Tooltip title="Çıkış" placement="right" disableHoverListener={drawerOpen}>
              <ListItemButton
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}
                sx={{ px: 3 }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 2 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                  <LogoutIcon />
                </ListItemIcon>
                {drawerOpen && (
                  <ListItemText primary="Çıkış" primaryTypographyProps={{ sx: { color: 'inherit' } }} />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          borderRadius: 0,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: 64,
            px: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setDrawerOpen(!drawerOpen)} sx={{ mr: 2 }} color="inherit">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Net gör, Net yönet!
            </Typography>
          </Box>
          <Box>
            <Tooltip title={darkMode ? "Aydınlık moda geç" : "Karanlık moda geç"}>
              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Bildirimler">
              <IconButton color="inherit">
                <NotificationsNoneIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Profil">
              <IconButton color="inherit">
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: drawerWidth, flexShrink: 0 }}>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
              borderRadius: 0,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.background.paper
                  : theme.palette.primary.main,
              color:
                theme.palette.mode === 'dark'
                  ? theme.palette.text.primary
                  : theme.palette.primary.contrastText,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

