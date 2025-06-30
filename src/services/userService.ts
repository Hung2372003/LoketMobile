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

const updateAvatar = async (imageUri: string) => {
  // 1. Tạo một đối tượng FormData
  const formData = new FormData();

  // 2. Lấy tên file và kiểu file từ URI
  const filename = imageUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename!);
  const type = match ? `image/${match[1]}` : `image`;

  // 3. Thêm file vào FormData
  // Key 'avatar' phải khớp với key mà backend của bạn yêu cầu
  formData.append('avatar', { uri: imageUri, name: filename, type } as any);

  try {
    // 4. Gửi request với FormData và header đặc biệt
    const response = await axiosInstance.post('/api/PersonalAction/UpdatePersonalInfor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.error) {
      throw new Error(response.data.title || 'Cập nhật ảnh đại diện thất bại.');
    }

    // Trả về dữ liệu thành công (ví dụ: object chứa url avatar mới)
    return response.data.object; 
  } catch (error) {
    throw error;
  }
};

const userService = {
    getMyProfile,
    updateMyProfile,
    updateAvatar,
};

export default userService;