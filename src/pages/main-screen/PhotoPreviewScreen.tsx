import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar, Platform,
} from 'react-native';
import { postService } from '../../services/postService';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Feather from '@react-native-vector-icons/feather';

interface PhotoPreviewScreenProps {
  navigation: any;
  route: {
    params: {
      photoUri: string;
      photoPath: string;
    };
  };
}

const PhotoPreviewScreen: React.FC<PhotoPreviewScreenProps> = ({ navigation, route }) => {
  const { photoUri, photoPath } = route.params;
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Fix image URI - ensure it has proper file:// prefix
  const imageUri = photoUri.startsWith('file://') ? photoUri : `file://${photoUri}`;

  console.log('Photo URI:', photoUri);
  console.log('Photo Path:', photoPath);
  console.log('Image URI for display:', imageUri);

  const handlePost = async () => {
    if (isPosting) return;

    setIsPosting(true);
    try {
      const postData = {
        content: content.trim() || undefined,
        status: 'PUBLIC',
        file: {
          path: photoPath,
          uri: photoUri,
        },
      };

      console.log('Posting data:', postData);
      await postService.createPost(postData);

      Alert.alert(
        'Thành công!',
        'Ảnh đã được đăng thành công',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainScreen'),
          },
        ]
      );
    } catch (error) {
      console.error('Post error:', error);
      Alert.alert('Lỗi', 'Không thể đăng ảnh. Vui lòng thử lại.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleDownload = async () => {
    const requestStoragePermission = async () => {
      if (Platform.OS === 'android') {
        const permission = Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        const result = await request(permission);
        return result === RESULTS.GRANTED;
      }
      return true;
    };

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Lỗi', 'Cần cấp quyền truy cập để lưu ảnh');
      return;
    }

    try {
      const timestamp = new Date().getTime();
      const ext = photoUri.split('.').pop() || 'jpg';
      const fileName = `locket_preview_${timestamp}.${ext}`;
      const downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.copyFile(imageUri, downloadPath);
      await CameraRoll.saveAsset(downloadPath, {
        type: 'photo',
        album: 'Ketlok',
      });

      Alert.alert('Thành công', 'Ảnh đã được lưu vào thư viện');
    } catch (error) {
      console.log('Download error:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh xuống. Vui lòng thử lại.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Gửi đến...</Text>
        <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
          {/*<Text style={styles.downloadText}>↓</Text>*/}
          <Feather name="download" size={24} style={styles.downloadText}/>
        </TouchableOpacity>
      </View>



      {/* Photo Preview */}
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.photo}
          onError={(error) => {
            console.log('Image load error:', error.nativeEvent.error);
          }}
          onLoad={() => {
            console.log('Image loaded successfully');
          }}
        />

        {/* Content Input Overlay */}
        <View style={styles.contentInputContainer}>
          <TextInput
            style={styles.contentInput}
            placeholder="Thêm một tin nhắn"
            placeholderTextColor="#FFF"
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={200}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          {/*<Text style={styles.closeButtonText}>✕</Text>*/}
          <Feather name="x" size={24} color="#FFF"/>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePost}
          style={[styles.sendButton, isPosting && styles.sendButtonDisabled]}
          disabled={isPosting}
        >
          {isPosting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Feather name="send" color="#FFF" size={24}/>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.textButton}>
          <Text style={styles.textButtonText}>Aa</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    gap: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0,
    paddingBottom: 15,
    position: 'relative',
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#FFF',
    transform: [{translateY: 50}],
  },
  headerSpacer: {
    width: 40,
  },
  downloadButton: {
    width: 45,
    height: 45,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{translateY: 40}],
  },
  downloadText: {
    color: '#FFF',
    fontSize: 20,
  },
  photoContainer: {
    width: '95%',
    height: '45%',
    marginTop: '25%',
    alignSelf: 'center',
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentInputContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
  },
  contentInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#FFF',
    padding: 15,
    borderRadius: 20,
    fontSize: 16,
    minHeight: 50,
    maxHeight: 100,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  closeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 24,
  },
  sendButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 28,
  },
  textButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  friendItem: {
    alignItems: 'center',
  },
  friendAvatarContainer: {
    marginBottom: 5,
  },
  selectedFriend: {
    borderWidth: 3,
    borderColor: '#FFA500',
    borderRadius: 30,
    padding: 2,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendAvatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendName: {
    color: '#CCC',
    fontSize: 12,
  },
  selectedFriendName: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
});

export default PhotoPreviewScreen;