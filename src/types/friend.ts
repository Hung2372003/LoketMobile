// src/types/friend.ts
export interface Friend {
  id: string;
  name: string;
  avatar: string; // Hoặc string nếu là URL, hoặc ImageSourcePropType từ 'react-native'
}

export interface AppLinkData {
  id: string;
  appName: string;
  iconColor?: string;
  isImage?: boolean;
  imageSource?: any; // ImageSourcePropType
};