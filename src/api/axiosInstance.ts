import axios, { AxiosError, Method } from 'axios';
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

const apiUrl = 'https://chatapi-49ao.onrender.com/api';
function handleError(error: AxiosError) {
  if (error.response) {
    console.log('API Error:', error.response.status, error.response.data);
  } else if (error.request) {
    console.log('No response received:', error.request);
  } else {
    console.log('Request setup error:', error.message);
  }
}

export async function callApi<T>(
  endpoint: string,
  method: Method,
  data?: any,
  isParm: boolean = false
): Promise<T> {
  try {
    const accessToken = await storage.getAccessToken();
    const url = `${apiUrl}/${endpoint}`;
    const config: any = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    };

    if (method.toLowerCase() === 'get' || isParm) {
      config.params = data;
    } else {
      config.data = data;
    }
    const response = await axios.request<T>(config);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw error;
  }
}


