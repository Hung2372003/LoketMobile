import {useEffect, useState} from 'react';
import {Camera} from 'react-native-vision-camera';
import {CameraState, Photo} from '../types/camera.ts';

export const useCamera = () => {
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    isRecording: false,
    flashMode: 'off',
    cameraPosition: 'front',
    hasPermission: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      const microphonePermission = await Camera.getMicrophonePermissionStatus();

      if (cameraPermission === 'not-determined') {
        const newCameraPermission = await Camera.requestCameraPermission();
        setCameraState(prev => ({
          ...prev,
          hasPermission: newCameraPermission === newCameraPermission,
          isActive: newCameraPermission === newCameraPermission,
        }));
      } else {
        setCameraState(prev => ({
          ...prev,
          hasPermission: cameraPermission === 'granted',
          isActive: cameraPermission === 'granted',
        }));
      }
    } catch (error) {
      console.error('Permission check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCamera = () => {
    setCameraState(prev => ({
      ...prev,
      cameraPosition: prev.cameraPosition === 'front' ? 'back' : 'front',
    }));
  };

  const toggleFlash = () => {
    setCameraState(prev => ({
      ...prev,
      flashMode: prev.flashMode === 'off' ? 'on' : 'off',
    }));
  };

  const takePhoto = async (camera: any): Promise<Photo | null> => {
    if (!camera.current) {
      return null;
    }

    try {
      const photo = await camera.current.takePhoto({
        flash: cameraState.flashMode,
        enableAutoRedEyeReduction: true,
        enableAutoStabilization: true,
        enableShutterSound: true,
      });

      return {
        id: Date.now().toString(),
        uri: photo.path,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Take photo error:', error);
      return null;
    }
  };

  return {
    cameraState,
    isLoading,
    toggleCamera,
    toggleFlash,
    takePhoto,
    checkPermissions,
  };
};