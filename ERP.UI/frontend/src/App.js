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
import StockCategoryListPage from './pages/StockCategoryListPage';
import StockGroupListPage from './pages/StockGroupListPage';


function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Kısayol & sağ tık engelleme
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        console.log(`CTRL+${e.key.toUpperCase()} engellendi.`);
      }
    };
    const handleContextMenu = (e) => {
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

  const theme = getTheme(darkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/me" element={<Me darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/branchs" element={<BranchListPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/users" element={<UserListPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/roles" element={<RoleListPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/stockCategory" element={<StockCategoryListPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/stockGroup" element={<StockGroupListPage darkMode={darkMode} setDarkMode={setDarkMode} />} />

          

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
