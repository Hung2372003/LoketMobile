export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface CameraState {
  isActive: boolean;
  isRecording: boolean;
  flashMode: 'on' | 'off' | 'auto';
  cameraPosition: 'back' | 'front' | 'authorized';
  hasPermission: boolean;
}

export interface Photo {
  id: string;
  uri: string;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
}