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

// Interceptor: Xử lý khi Access Token hết hạn
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Nếu request thành công, không làm gì cả
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Kiểm tra nếu lỗi là 401 và request này chưa được thử lại
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Đánh dấu là đã thử lại

//       try {
//         const refreshToken = await storage.getRefreshToken();
//         if (!refreshToken) {
//             // Nếu không có refresh token, đăng xuất người dùng
//             // (Bạn sẽ cần thêm logic điều hướng ở đây)
//             console.log("No refresh token, logging out.");
//             await storage.clearTokens();
//             return Promise.reject(error);
//         }

//         // Gọi API để làm mới token
//         const { data } = await axiosInstance.post('/auth/refresh', { refreshToken });

//         // Lưu lại token mới
//         await storage.storeTokens(data.tokens);

//         // Cập nhật header của request ban đầu với token mới
//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.tokens.accessToken}`;
//         originalRequest.headers['Authorization'] = `Bearer ${data.tokens.accessToken}`;

//         // Thực hiện lại request ban đầu đã thất bại
//         return axiosInstance(originalRequest);

//       } catch (refreshError) {
//         // Nếu làm mới token thất bại, đăng xuất người dùng
//         console.log("Refresh token failed, logging out.", refreshError);
//         await storage.clearTokens();
//         // (Bạn sẽ cần thêm logic điều hướng ở đây, ví dụ: navigation.navigate('Login'))
//         return Promise.reject(refreshError);
//       }
//     }

//     // Trả về lỗi nếu không phải 401 hoặc các trường hợp khác
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;