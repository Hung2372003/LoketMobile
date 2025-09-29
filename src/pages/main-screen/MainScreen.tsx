import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
} from 'react-native-vision-camera';
import { useCamera } from '../../hooks/useCamera';
import CameraService from '../../services/CameraService';
import TopBar from '../../component/camera/TopBar';
import CameraControls from '../../component/camera/CameraControls';
import HistorySection from '../../component/camera/HistorySection';
import { Friend } from '../../types/camera';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchProfile } from '../../redux/profileSlice';
import { chatManagementApi } from '../../api/endpoint.api';
import { onReceiveMessage } from '../../services/signalR.service';
import { launchImageLibrary } from 'react-native-image-picker';
import Feather from '@react-native-vector-icons/feather';

interface MainScreenProps {
  navigation: any;
}

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const { cameraState, isLoading, toggleCamera, toggleFlash, takePhoto } = useCamera();

  const dispatch = useDispatch<AppDispatch>();
  // Lấy dữ liệu profile và trạng thái fetch từ store
  const { data: profileData } = useSelector((state: RootState) => state.profile);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [NotifiMess, setNotifiMess] = useState<number>();

  const device = cameraState.cameraPosition === 'front'
    ? devices.find(d => d.position === 'front')
    : devices.find(d => d.position === 'back');

  useEffect(() => {

    dispatch(fetchProfile());
    loadInitialData();
    onReceiveMessage(getNotifi);
    getNotifi();
  }, [dispatch]);

  const loadInitialData = async () => {
    try {
      const [friendsData, notifCount] = await Promise.all([
        CameraService.getFriends(),
        CameraService.getNotificationCount(),
      ]);

      setFriends(friendsData);
      setNotificationCount(notifCount);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

    const getNotifi = async ()=>{
      const data = await chatManagementApi.getCountNewMessage();
      setNotifiMess(data.count);
     };
  const handleTakePhoto = async () => {
    if (!camera.current || isPhotoLoading) {return;}

    setIsPhotoLoading(true);
    try {
      const photo = await takePhoto(camera);
      if (photo) {
        console.log('photo', photo);
        // Navigate to preview screen instead of uploading directly
        navigation.navigate('PhotoPreviewScreen', {
          photoUri: photo.path || photo.uri, // Support both path and uri
          photoPath: photo.path || photo.uri,
        });
      }
    } catch (error) {
      console.error('Photo capture error:', error);
      Alert.alert('Lỗi', 'Không thể chụp ảnh');
    } finally {
      setIsPhotoLoading(false);
    }
  };

  // ADDED: Hàm xử lý chọn ảnh từ album
  const handleSelectFromAlbum = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorMessage);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const selectedPhoto = result.assets[0];
      if (selectedPhoto.uri) {
        navigation.navigate('PhotoPreviewScreen', {
          photoUri: selectedPhoto.uri,
          photoPath: selectedPhoto.uri, // Đối với image-picker, uri cũng là path
        });
      }
    }
  };

  const handleProfilePress = () => {
    navigation.navigate('ProfileScreen');
  };

  const handleMessagePress = () => {
    console.log('Navigate to messages');
    navigation.navigate('ChatHistory');
  };

  const handleCenterPress = () => {
    console.log('Navigate to friend');
    navigation.navigate('FriendsScreen');
  };

  const handleHistoryPress = () => {
    // TODO: Navigate to history screen
    console.log('Navigate to history');
  };



  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
        <Text style={styles.loadingText}>Đang tải camera...</Text>
      </View>
    );
  }

  // No permission state
  if (!cameraState.hasPermission) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Cần quyền truy cập camera để sử dụng ứng dụng
        </Text>
      </View>
    );
  }

  // No device state
  if (!device) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Không tìm thấy camera
        </Text>
      </View>
    );
  }

  const getFlashIcon = () => {
    if (cameraState.flashMode === 'on') return 'zap';
    return 'youtube';
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrapper}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={cameraState.isActive}
          photo={true}
          enableZoomGesture
        />

        <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
          <Feather
            name={getFlashIcon()}
            size={24}
            color={cameraState.flashMode === 'on' ? '#FFD700' : '#FFF'}
          />
        </TouchableOpacity>

      </View>

      <TopBar
        friends={friends}
        notificationCount={NotifiMess ?? 0}
        onProfilePress={handleProfilePress}
        onMessagePress={handleMessagePress}
        onCenterPress={handleCenterPress}
        mode = "camera"
        profileImage={profileData?.profileImage}
      />

      <CameraControls
        onTakePhoto={handleTakePhoto}
        onToggleCamera={toggleCamera}
        onSelectFromAlbum={handleSelectFromAlbum}
        isLoading={isPhotoLoading}
      />

      <HistorySection onHistoryPress={handleHistoryPress} />
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraWrapper: {
    width: '95%',
    height: '45%',
    marginTop: '55%',
    alignSelf: 'center',
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  flashButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Đảm bảo nút nằm trên camera
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MainScreen;
