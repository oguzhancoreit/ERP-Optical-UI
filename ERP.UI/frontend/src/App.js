// src/App.js

import { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import getTheme from './theme';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import Me from './pages/Me';
import BranchListPage from './pages/BranchListPage';
import UserListPage from './pages/UserListPage';
import RoleListPage from './pages/RoleListPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Sayfa ilk yüklendiğinde localStorage'dan tema bilgisi alınır
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Tema değiştiğinde localStorage'a yazılır
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // 🚫 Klavye kısayolları ve sağ tıklama engelleme
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S engelleme (sayfa kaydetmeyi önler)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        console.log('CTRL+S engellendi.');
      }
      // Ctrl+P engelleme (yazdırmayı önler)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        console.log('CTRL+P engellendi.');
      }
    };

    const handleContextMenu = (e) => {
      // Sağ tıklama menüsünü engelle
      e.preventDefault();
      console.log('Sağ tıklama engellendi.');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Tema nesnesini oluştur
  const theme = getTheme(darkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/me"
            element={<Me darkMode={darkMode} setDarkMode={setDarkMode} />}
          />
          <Route
            path="/branchs"
            element={
              <BranchListPage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
          <Route
            path="/users"
            element={
              <UserListPage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
          <Route
            path="/roles"
            element={
              <RoleListPage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
