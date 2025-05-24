// CameraComponent.tsx
import React, {useState} from 'react';
import {
  NativeModules,
  Button,
  PermissionsAndroid,
  Platform,
  Image,
  Text,
  StyleSheet,
} from 'react-native';

// Khai báo CameraModule rõ ràng với TypeScript
interface CameraModuleType {
  openCamera(): Promise<string>;
}

const {CameraModule} = NativeModules as {CameraModule: CameraModuleType};

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  }
};

const CameraComponent = ({onPhotoCaptured}: {onPhotoCaptured: (uri: string) => void}) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const openCamera = async () => {
    await requestPermissions();
    try {
      const result = await CameraModule.openCamera();
      console.log('Ảnh lưu tại:', result);
      setPhotoUri(result); // Lưu đường dẫn ảnh
      onPhotoCaptured(result); // Truyền đường dẫn ảnh về component cha
    } catch (err) {
      console.warn('Lỗi camera:', err);
    }
  };

  return (
    <React.Fragment>
      <Button title="Chụp ảnh" onPress={openCamera} />
      {photoUri && (
        <>
          <Text style={styles.text}>Ảnh đã chụp:</Text>
          <Image source={{uri: photoUri}} style={styles.image} />
        </>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  image: {width: 300, height: 400, marginTop: 20, borderRadius: 8},
  text: {marginTop: 10, fontSize: 16},
});

export default CameraComponent;
