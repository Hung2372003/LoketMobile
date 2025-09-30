import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventEmitter } from "events";
const ACCESS_TOKEN_KEY = 'accessToken';
const USER_ID_KEY = 'userId';
export const storageEvents = new EventEmitter();
const storeTokens = async (accessToken: string ) => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    storageEvents.emit("TOKEN_CHANGED", accessToken);
  } catch (e) {
    console.error('Failed to store tokens', e);
  }
};

const storeUserId = async (userId: number) => {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, String(userId));
  } catch (e) {
    console.error('Failed to store user ID', e);
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


const getUserId = async () => {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch (e) {
    console.error('Failed to get user ID', e);
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
    storageEvents.emit("TOKEN_CHANGED", null);
  } catch (e) {
    console.error('Failed to clear tokens', e);
  }
};

const clearUserId = async () => {
  try {
    await AsyncStorage.removeItem(USER_ID_KEY);
  } catch (e) {
    console.error('Failed to clear user ID', e);
  }
};

const tokenService = {
  storeTokens,
  getAccessToken,
  clearTokens,
  storeUserId,
  getUserId,
  clearUserId,

};

export default tokenService;