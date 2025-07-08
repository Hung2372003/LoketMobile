import axiosInstance from '../api/axiosInstance';

const getFriends = async () => {
  try {
    const response = await axiosInstance.get('/api/ContactUser/ListFrends');
    return response.data;
  } catch (error) {

    throw error;
  }
};

// 1. Lấy danh sách lời mời kết bạn
const getFriendRequests = async () => {
  try {
    const response = await axiosInstance.get('/api/PersonalAction/ListFrendRequest');
    if (response.data.error) {
      throw new Error(response.data.title || 'Không thể tải lời mời kết bạn.');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. Tìm kiếm bạn bè
const searchFriends = async (name: string) => {
  try {
    const response = await axiosInstance.post('/api/PersonalAction/SeachPeople', `"${name}"`);
    if (response.data.error) {
      throw new Error(response.data.title || 'Tìm kiếm thất bại.');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 3. Gửi lời mời kết bạn
const sendFriendRequest = async (userId: number) => {
  try {
    const response = await axiosInstance.post('/api/PersonalAction/FriendRequest', userId);
    if (response.data.error) {
      throw new Error(response.data.title || 'Gửi lời mời thất bại.');
    }
    return response.data.object;
  } catch (error) {
    throw error;
  }
};

// 4. Chấp nhận lời mời kết bạn
const acceptFriendRequest = async (friendCode: number) => {
  try {
    const response = await axiosInstance.patch('/api/PersonalAction/FriendAccept', {}, {
      params: { FriendCode: friendCode }});
    if (response.data.error) {
      throw new Error(response.data.title || 'Đồng ý kết bạn thất bại.');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const removeFriend = async (friendCode: number) => {
  try {
    const response = await axiosInstance.delete('/api/PersonalAction/Unfriend', {
      params: { FriendCode: friendCode }});

    // Xử lý response chuẩn từ backend của bạn
    if (response.data.error) {
      throw new Error(response.data.title || 'Xóa bạn thất bại.');
    }
    return response.data;
  } catch (error) {
    // Ném lỗi để component có thể bắt và xử lý
    throw error;
  }
};

const getListFriends = async () => {
  try {
    const response = await axiosInstance.get('/api/ContactUser/ListFriends');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const friendService = {
  getFriends,
  getFriendRequests,
  searchFriends,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getListFriends,
};

export default friendService;