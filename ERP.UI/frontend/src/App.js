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
import BranchListPage from './pages/BranchListPage'; // ✅ Şube sayfası eklendi

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // localStorage'dan tema okuma
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') setDarkMode(true);
  }, []);

  // tema değişince localStorage'a yaz
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
            element={<BranchListPage darkMode={darkMode} setDarkMode={setDarkMode} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
