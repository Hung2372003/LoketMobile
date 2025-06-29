import axiosInstance from '../api/axiosInstance';

const getFriends = async () => {
  try {
    const response = await axiosInstance.get('/api/ContactUser/ListFrends');
    return response.data;
  } catch (error) {

    throw error;
  }
};

const friendService = {
  getFriends,
};

export default friendService;