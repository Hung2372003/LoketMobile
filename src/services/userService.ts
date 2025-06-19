import axiosInstance from '../api/axiosInstance';
import stogare from '../api/storage'

const getMyProfile = async () => {
    try {
         const userId = await stogare.getUserId();

        if (!userId) {
            throw new Error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        }

        const response = await axiosInstance.post('/api/PersonalAction/GetPersonalInformation', Number(userId));
        if(response.data.error) {
            throw new Error('Lỗi khi lấy thông tin profile.');
        }
        return response.data.object;
    } catch (error) {

        throw error;
    }
};

// Hàm cập nhật thông tin profile
const updateMyProfile = async (profileData: { fullName: string; phoneNumber?: string }) => {
  try {
    const response = await axiosInstance.post('/users/update', profileData);
    if (response.data.error) {
      throw new Error(response.data.title);
    }
    return response.data;
  } catch (error) {

    throw error;
  }
};

const userService = {
    getMyProfile,
    updateMyProfile,
};

export default userService;