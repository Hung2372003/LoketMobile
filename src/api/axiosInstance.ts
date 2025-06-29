import axios from 'axios';
import storage from './storage';

const axiosInstance = axios.create({
  baseURL: 'https://chatapi-49ao.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động đính kèm Access Token vào mỗi request
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await storage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
