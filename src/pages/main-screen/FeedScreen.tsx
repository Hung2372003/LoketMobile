import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Alert,
  Platform, InteractionManager,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import TopBar from '../../component/camera/TopBar';
import FeedOptionsModal from './FeedOptionsModal';
import { usePosts } from '../../hooks/usePosts';
import { convertPostsToFeedItems, FeedItem } from '../../utils/postUtils';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {useRoute, RouteProp} from '@react-navigation/native';
import {postService} from '../../services/postService.ts';
import storage from '../../api/storage.ts';
import ActivityModal from '../../component/feed/ActivityModal.tsx';
const { width, height } = Dimensions.get('window');
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchProfile } from '../../redux/profileSlice';
import { chatManagementApi, PostManagementApi, UpdateMessageRequestData } from '../../api/endpoint.api.ts';
import ChatService from '../../services/chat.service.ts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigation';

type ChatHistoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatHistory'>;

type FeedScreenProps = {
  navigation: any;
  route?: {
    params?: {
      initialIndex?: number;
      photoTransition?: {
        photoId: number;
        imageUri: string;
        startPosition: { x: number; y: number; width: number; height: number };
      };
    };
  };
};

type FeedScreenRouteParams = {
  selectedPhotoId?: number;
  photoTransition?: any; // nếu có
};


interface user {
  id: number;
  name: string;
  avatar: string;
}

interface UserActivity {
    id: number;
    name: string;
    avatar: string;
    emoji: string;
}

const FeedScreen = ({ navigation, route }: FeedScreenProps) => {
 const navigationChat = useNavigation<ChatHistoryNavigationProp>();
  const { posts, loading, error, refreshing, refreshPosts } = usePosts();
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { data: profileData } = useSelector((state: RootState) => state.profile);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pagerRef = useRef<PagerView>(null);
  const routePhoto = useRoute<RouteProp<{ FeedScreen: FeedScreenRouteParams }, 'FeedScreen'>>();
  const { selectedPhotoId } = routePhoto.params ?? {};
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [didNavigate, setDidNavigate] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [activityList, setActivityList] = useState<UserActivity[]>([]);


    // Animation states cho transition
  const [transitionAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [positionAnim] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

  useEffect(() => {
    const fetchUserId = async () => {
      const userIdStr = await storage.getUserId();
      setCurrentUserId(Number(userIdStr));
    };
    fetchUserId();
  }, []);


  // Convert và giữ nguyên data
  useEffect(() => {
    if (posts.length > 0) {
      const converted = convertPostsToFeedItems(posts);
      const filtered = converted.filter(item => item.user.name !== 'Admin');
      setFeedData(filtered);
    }
  }, [posts]);


  React.useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  // Handle navigation params khi component mount
  useEffect(() => {
    if (
      selectedPhotoId &&
      feedData.length > 0 &&
      pagerRef.current &&
      !didNavigate
    ) {
      const index = feedData.findIndex(item => Number(item.id) === Number(selectedPhotoId));
      console.log('selectedPhotoId:', selectedPhotoId);
      console.log('feedData ids:', feedData.map(i => i.id));
      console.log('Found index:', index);

      if (index >= 0) {
        InteractionManager.runAfterInteractions(() => {
          pagerRef.current?.setPage(index);
          setCurrentIndex(index);
          setDidNavigate(true);
        });
      }
    }
  }, [selectedPhotoId, feedData, didNavigate]);



  // Handle photo transition animation
  useEffect(() => {
    if (route?.params?.photoTransition && feedData.length > 0) {
      handlePhotoTransition();
    }
  }, [route?.params?.photoTransition, feedData]);

  const handlePhotoTransition = () => {
    const transition = route?.params?.photoTransition;
    if (!transition) {return;}

    setIsTransitioning(true);

    // Tìm index của photo được click
    const targetIndex = feedData.findIndex(item => item.id === transition.photoId);
    if (targetIndex === -1) {return;}

    // Set initial position và scale
    const startPos = transition.startPosition;
    const centerX = width / 2;
    const centerY = height / 2;

    positionAnim.setValue({
      x: startPos.x + startPos.width / 2 - centerX,
      y: startPos.y + startPos.height / 2 - centerY,
    });

    const initialScale = Math.min(startPos.width / width, startPos.height / height);
    scaleAnim.setValue(initialScale);
    transitionAnim.setValue(0);

    // Set page trước khi animate
    setCurrentIndex(targetIndex);
    pagerRef.current?.setPage(targetIndex);

    // Animate transition
    Animated.parallel([
      Animated.timing(transitionAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(positionAnim, {
        toValue: { x: 0, y: 0 },
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsTransitioning(false);
      // Reset navigation params
      navigation.setParams({
        initialIndex: undefined,
        photoTransition: undefined,
      });
    });
  };

  // Animation cho popup
  useEffect(() => {
    if (showPopup) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showPopup]);

  const handleProfilePress = () => {
    navigation?.navigate('ProfileScreen');
  };

  const handleCenterPress = () => {
    navigation?.navigate('FriendsScreen');
  };

  const handleMessagePress = () => {
    navigation?.navigate('ChatHistory');
  };

  const handleMorePress = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const permission = Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

        const result = await request(permission);
        return result === RESULTS.GRANTED;
      } else {
        // iOS không cần permission để save vào Photos
        return true;
      }
    } catch (error) {
      console.log('Permission error:', error);
      return false;
    }
  };

  const downloadImage = async (imageUrl: string, postId: number) => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Lỗi', 'Cần cấp quyền truy cập để lưu ảnh');
        return;
      }

      setDownloading(true);
      // Tạo tên file unique
      const timestamp = new Date().getTime();
      const fileExtension = imageUrl.split('.').pop() || 'jpg';
      const fileName = `locket_${postId}_${timestamp}.${fileExtension}`;

      // Đường dẫn tạm để lưu file
      const downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Download file
      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: downloadPath,
        background: true,
        discretionary: true,
      }).promise;

      if (downloadResult.statusCode === 200) {
        // Lưu vào Camera Roll
        await CameraRoll.saveAsset(downloadPath, {
          type: 'photo',
          album: 'Locket', // Tạo album riêng
        });

        // Xóa file tạm
        await RNFS.unlink(downloadPath);

        Alert.alert('Thành công', 'Ảnh đã được lưu vào thư viện');
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.log('Download error:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh xuống. Vui lòng thử lại.');
    } finally {
      setDownloading(false);
    }
  };

  const getCurrentImageUrl = () => {
    if (feedData.length > 0 && feedData[currentIndex]) {
      const currentItem = feedData[currentIndex];
      return currentItem.image;
    }
    return null;
  };

  const getCurrentPostId = () => {
    if (feedData.length > 0 && feedData[currentIndex]) {
      return feedData[currentIndex].id;
    }
    return null;
  };

  const handleMenuAction = async (action: string) => {
    console.log(`Action selected: ${action}`);

    switch (action) {
      case 'download':
        const imageUrl = getCurrentImageUrl();
        const postId = getCurrentPostId();

        if (imageUrl && postId) {
          await downloadImage(imageUrl, postId);
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy ảnh để tải xuống');
        }
        setShowPopup(false);
        break;

      case 'share':
        // TODO: Implement share functionality
        Alert.alert('Thông báo', 'Chức năng chia sẻ sẽ được cập nhật sau');
        break;

      case 'delete':
        const postItem = feedData[currentIndex];
        if (!postItem) {
          Alert.alert('Lỗi', 'Không tìm thấy bài viết');
          break;
        }

        if (postItem.user.id !== currentUserId) {
          Alert.alert('Thông báo', 'Bạn không thể xóa bài viết của người khác');
          break;
        }

        try {
          await postService.deletePost(Number(postItem.id));
          Alert.alert('Thành công', 'Xóa bài viết thành công');

          // Gọi refetch list
          refreshPosts();
        } catch (error) {
          Alert.alert('Lỗi', 'Không thể xóa bài viết, vui lòng thử lại');
        }
        break;


      default:
        break;
    }

    setShowPopup(false);
  };


  const openchat = async ( imageId:number,user:user,path:string,content?:string) => {
    console.log(content,user,path);
    try{
       const data = await chatManagementApi.createChatBox({groupChatId:undefined,userCode:user.id});
        console.log(data);
        const file = await ChatService.downloadImageAsFile(path);
        const updateMessageRequest : UpdateMessageRequestData = {
          groupChatId: data.preventiveObject.groupChatId,
          content: content,
          file: [file],
        };
        const newList:Array<number> = [];
        newList.push(user.id);
        console.log(updateMessageRequest);
        const newi =  await ChatService.updateMessage(updateMessageRequest);
        console.log(newi);
         navigationChat.navigate('ChatBox', {
          groupChatId:data.preventiveObject.groupChatId,
          groupAvatar:user.avatar,
          groupName:user.name,
          listUser:newList,
         });
    }catch(chatError){
      throw chatError;
    }

    };
  
  const feeling = async (feelingType: string, postId: number) => {
      try{
          const message = await PostManagementApi.FeelPost({ postCode: postId, feeling: feelingType });
          console.log(message);
      }catch(feelingError){
        throw feelingError;
      }


    };

    const handleOpenActivityModal = () => {
        const data: UserActivity[] = [
            { id: 1, name: 'Nam', avatar: 'https://i.pravatar.cc/100', emoji: '💛' },
            { id: 2, name: 'Huy', avatar: 'https://i.pravatar.cc/101', emoji: '🔥' },
            { id: 3, name: 'Phúc', avatar: 'https://i.pravatar.cc/102', emoji: '😂' },
        ];
        setActivityList(data);
        setActivityModalVisible(true);
    };


    if (loading && feedData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <TopBar
          centerText="Tất cả bạn bè"
          showDropdown={true}
          notificationCount={3}
          onProfilePress={handleProfilePress}
          onCenterPress={handleCenterPress}
          onMessagePress={handleMessagePress}
          mode="feed"
          profileImage={profileData?.profileImage}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Có lỗi xảy ra: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshPosts}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        centerText="Tất cả bạn bè"
        showDropdown={true}
        notificationCount={3}
        onProfilePress={handleProfilePress}
        onCenterPress={handleCenterPress}
        onMessagePress={handleMessagePress}
        mode="feed"
        profileImage={profileData?.profileImage}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
        orientation="vertical"
      >
        {feedData.map((item, index) => (
          <View key={item.id} style={styles.feedItem}>
            <View style={styles.imageContainer}>
                <Animated.Image
                  source={{ uri: item.image }}
                  style={[
                    styles.feedImage,
                    isTransitioning && index === currentIndex && {
                      opacity: transitionAnim,
                      transform: [
                        { scale: scaleAnim },
                        { translateX: positionAnim.x },
                        { translateY: positionAnim.y },
                      ],
                    },
                  ]}
                  onError={(error) => {
                    console.log('Image load error:', error.nativeEvent.error);
                  }}
                />

              {item.caption && (
                <View style={styles.captionOverlay}>
                  <Text style={styles.caption}>{item.caption}</Text>
                </View>
              )}
            </View>

            <View style={styles.userInfoContainer}>
              <Image
                source={{ uri: item.user.avatar }}
                style={styles.userAvatar}
                onError={(error) => {
                  console.log('Avatar load error:', error.nativeEvent.error);
                }}
              />
              <View style={styles.userTextInfo}>
                <Text style={styles.userName}>{item.user.name}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </View>
              {item.user.id === currentUserId ? (
                  <View style={styles.noActivityContainer}>
                      <TouchableOpacity onPress={handleOpenActivityModal}>
                          <Text style={styles.noActivityText}>✨ Chưa có hoạt động nào! (Xem hoạt động)</Text>
                      </TouchableOpacity>
                  </View>
              ) : (
                  <View style={styles.messageInputArea}>
                      <TouchableOpacity
                          onPress={() => openchat(parseInt(item.id, 36), item.user, item.image, item.caption)}
                          style={styles.messageInput}
                      >
                          <Text style={styles.messageInputPlaceholder}>Gửi tin nhắn...</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => feeling('💛', parseInt(item.id, 10))} style={styles.emojiButton}>
                          <Text style={styles.emoji}>💛</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => feeling('🔥', parseInt(item.id, 10))} style={styles.emojiButton}>
                          <Text style={styles.emoji}>🔥</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => feeling('😂', parseInt(item.id, 10))} style={styles.emojiButton}>
                          <Text style={styles.emoji}>😂</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => feeling('😍', parseInt(item.id, 10))} style={styles.emojiButton}>
                          <Text style={styles.emoji}>😍</Text>
                      </TouchableOpacity>
                  </View>
              )}

          </View>
        ))}
      </PagerView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ListPhotoScreen')}>
          <View style={styles.gridIcon}>
            <View style={[styles.dot, styles.topLeft]} />
            <View style={[styles.dot, styles.topRight]} />
            <View style={[styles.dot, styles.bottomLeft]} />
            <View style={[styles.dot, styles.bottomRight]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cameraButton} onPress={() => navigation.navigate('MainScreen')}>
          <View style={styles.cameraButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={handleMorePress}>
          <View style={styles.moreIcon}>
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Feed Options Modal */}
      <FeedOptionsModal
        visible={showPopup && !downloading}
        onClose={handleClosePopup}
        onMenuAction={handleMenuAction}
        fadeAnim={fadeAnim}
      />

      {downloading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Đang tải ảnh...</Text>
        </View>
      )}

      <ActivityModal
        visible={activityModalVisible}
        onClose={() => setActivityModalVisible(false)}
        activities={activityList}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  pagerView: {
    flex: 1,
  },

  feedItem: {
    width: width,
    height: height - 80,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  imageContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },

  feedImage: {
    width: '100%',
    height: '65%',
    marginTop: '55%',
    alignSelf: 'center',
    borderRadius: 40,
    backgroundColor: '#000',
  },

  captionOverlay: {
    position: 'absolute',
    bottom: 20,
    left: '20%',
    right: '20%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  caption: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'center',
  },

  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },

  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },

  userTextInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },

  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  timestamp: {
    color: '#666',
    fontSize: 14,
    opacity: 0.8,
  },

  messageInputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },

  messageInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginRight: 10,
  },

  messageInputPlaceholder: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.7,
  },

  emojiButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  emoji: {
    fontSize: 26,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },

  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },

  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },

  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },

  navButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },

  cameraButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },

  gridIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },

  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    position: 'absolute',
  },

  topLeft: {
    top: 0,
    left: 0,
  },

  topRight: {
    top: 0,
    right: 0,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
  },

  moreIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  moreDot: {
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    marginHorizontal: 2,
  },
  noActivityContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },

  noActivityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeedScreen;
