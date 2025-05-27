import {
  Box, CssBaseline, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, AppBar, Typography,
  IconButton, Collapse, useTheme, Tooltip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import logo from '../assets/logo.png';

const expandedDrawerWidth = 240;
const collapsedDrawerWidth = 72;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/me',
  },
  {
    text: 'Yönetim',
    icon: <PeopleIcon />,
    children: [
      { text: 'Kullanıcılar', path: '/users' },
      { text: 'Roller', path: '/roles' },
    ],
  },
  {
    text: 'Ayarlar',
    icon: <SettingsIcon />,
    path: '/settings',
  },
];

export default function SidebarLayout({ children, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [openMenus, setOpenMenus] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(true);

  const drawerWidth = drawerOpen ? expandedDrawerWidth : collapsedDrawerWidth;

  const toggleSubMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: drawerOpen ? 'flex-start' : 'center',
          backgroundColor: theme.palette.background.paper,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Logo"
          onClick={() => navigate('/')}
          sx={{
            height: 32,
            mr: drawerOpen ? 1 : 0,
            transition: 'margin 0.3s',
            cursor: 'pointer',
          }}
        />
        {drawerOpen && (
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
          >
            CoreOpticalApp
          </Typography>
        )}
      </Toolbar>

      <List disablePadding>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Box key={item.text}>
              <ListItem disablePadding>
                <Tooltip title={item.text} placement="right" disableHoverListener={drawerOpen}>
                  <ListItemButton
                    onClick={() =>
                      item.children ? toggleSubMenu(item.text) : navigate(item.path)
                    }
                    selected={isActive}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.action.selected,
                        color: theme.palette.primary.contrastText,
                        '& .MuiListItemIcon-root': {
                          color: theme.palette.primary.contrastText,
                        },
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      color: theme.palette.text.primary,
                      px: 3,
                      transition: 'all 0.25s ease-in-out',
                    }}
                  >
                    <ListItemIcon sx={{ color: theme.palette.text.secondary, minWidth: 0, mr: drawerOpen ? 2 : 'auto', justifyContent: 'center' }}>
                      {item.icon}
                    </ListItemIcon>
                    {drawerOpen && <ListItemText primary={item.text} />}
                    {item.children && drawerOpen && (openMenus[item.text] ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </Tooltip>
              </ListItem>

              {item.children && (
                <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <ListItem key={child.text} disablePadding>
                          <Tooltip title={child.text} placement="right" disableHoverListener={drawerOpen}>
                            <ListItemButton
                              onClick={() => navigate(child.path)}
                              selected={isChildActive}
                              sx={{
                                pl: drawerOpen ? 6 : 3,
                                py: 1,
                                fontSize: '0.875rem',
                                color: isChildActive
                                  ? theme.palette.primary.contrastText
                                  : theme.palette.text.secondary,
                                bgcolor: isChildActive
                                  ? theme.palette.primary.main
                                  : 'inherit',
                                '&:hover': {
                                  bgcolor: theme.palette.action.hover,
                                },
                                transition: 'all 0.2s ease-in-out',
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 28 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                              </ListItemIcon>
                              {drawerOpen && <ListItemText primary={child.text} />}
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

        <ListItem disablePadding>
          <Tooltip title="Çıkış" placement="right" disableHoverListener={drawerOpen}>
            <ListItemButton
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
              sx={{
                px: 3,
                '&:hover': { bgcolor: theme.palette.action.hover },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 0, mr: drawerOpen ? 2 : 'auto', justifyContent: 'center' }}>
                <LogoutIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Çıkış" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          transition: 'width 0.3s ease, margin 0.3s ease',
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
            <IconButton onClick={() => setDrawerOpen(!drawerOpen)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Yönetim Paneli
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton color="inherit">
              <NotificationsNoneIcon />
            </IconButton>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
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
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: '4px 0 12px rgba(0,0,0,0.08)',
              borderRight: 'none',
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
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
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          p: 3,
          transition: 'margin 0.3s ease, width 0.3s ease',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
