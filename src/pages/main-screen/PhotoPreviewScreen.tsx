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
  StatusBar,
} from 'react-native';
import { postService } from '../../services/postService';

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
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Fix image URI - ensure it has proper file:// prefix
  const imageUri = photoUri.startsWith('file://') ? photoUri : `file://${photoUri}`;

  console.log('Photo URI:', photoUri);
  console.log('Photo Path:', photoPath);
  console.log('Image URI for display:', imageUri);

  // Mock friends data - bạn có thể lấy từ CameraService hoặc context
  const friends = [
    { id: '1', name: 'Tất cả', avatar: 'https://via.placeholder.com/40', selected: true },
    { id: '2', name: 'Bin', avatar: 'https://via.placeholder.com/40', selected: false },
    { id: '3', name: 'Hung', avatar: 'https://via.placeholder.com/40', selected: false },
  ];

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

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gửi đến...</Text>
        <TouchableOpacity onPress={handleClose} style={styles.downloadButton}>
          <Text style={styles.downloadText}>↓</Text>
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

        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePost}
          style={[styles.sendButton, isPosting && styles.sendButtonDisabled]}
          disabled={isPosting}
        >
          {isPosting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.sendButtonText}>✈</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.textButton}>
          <Text style={styles.textButtonText}>Aa</Text>
        </TouchableOpacity>
      </View>

      {/* Friends Selection */}
      <View style={styles.friendsContainer}>
        {friends.map((friend) => (
          <TouchableOpacity
            key={friend.id}
            style={styles.friendItem}
            onPress={() => toggleFriendSelection(friend.id)}
          >
            <View style={[
              styles.friendAvatarContainer,
              friend.id === '1' && styles.selectedFriend
            ]}>
              <View style={styles.friendAvatar}>
                <Text style={styles.friendAvatarText}>
                  {friend.id === '1' ? '👥' : friend.name.charAt(0)}
                </Text>
              </View>
            </View>
            <Text style={[
              styles.friendName,
              friend.id === '1' && styles.selectedFriendName
            ]}>
              {friend.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadText: {
    color: '#FFF',
    fontSize: 20,
  },
  photoContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentInputContainer: {
    position: 'absolute',
    bottom: 80,
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
  paginationContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFF',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 50,
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