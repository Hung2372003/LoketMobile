import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'accessToken';

const storeTokens = async (accessToken: string ) => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } catch (e) {
    console.error('Failed to store tokens', e);
  }
};

const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (e) {
    console.error('Failed to get access token', e);
    return null;
  }
};

// const getRefreshToken = async () => {
//   try {
//     return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
//   } catch (e) {
//     console.error('Failed to get refresh token', e);
//     return null;
//   }
// };

const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (e) {
    console.error('Failed to clear tokens', e);
  }
};

const tokenService = {
  storeTokens,
  getAccessToken,
  clearTokens,
};

export default tokenService;