
export interface Friend {
  id: number;
  name: string;
  avatar: string;
}

export interface AppLinkData {
  id: string;
  appName: string;
  iconColor?: string;
  isImage?: boolean;
  imageSource?: any;
};