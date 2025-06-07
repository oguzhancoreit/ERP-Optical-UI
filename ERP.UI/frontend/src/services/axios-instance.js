import axios from 'axios';

// Ana axios örneği
const instance = axios.create({
  baseURL: 'https://localhost:7164/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Otomatik token ve dbName ekleme
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const dbName = localStorage.getItem('dbName');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  if (dbName) {
    config.headers['DbName'] = dbName;
  }
  return config;
}, (error) => Promise.reject(error));

// Opsiyonel: 401 hatalarında log (ya da yönlendirme eklenebilir)
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('Yetkisiz erişim.');
      // logout işlemi veya yönlendirme burada yapılabilir
    }
    return Promise.reject(error);
  }
);

export default instance;
