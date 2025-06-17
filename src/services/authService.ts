import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

const login = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post(
      '/api/Security/UserLogin',
      {
        username: username,
        password: password,
      });

    if (response.data.error === true) {
      throw new Error(response.data.title || 'Thông tin đăng nhập không chính xác');
    }

    const token = response.data.object;
    const userId = response.data.id;
    const title = response.data.title;

    if (!token) {
      throw new Error('Không nhận được token xác thực.');
    }

    return { token, userId, title};
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
    }
    throw error;
  }
};

const authService = {
  login,
  // Thêm register, logout...
};

export default authService;