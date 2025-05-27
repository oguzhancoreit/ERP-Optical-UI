// src/services/axios-instance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://localhost:7164/api',
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const dbName = localStorage.getItem('dbName');

  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  if (dbName) config.headers['DbName'] = dbName;

  return config;
});

export default instance;
