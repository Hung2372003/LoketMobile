import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import TopBar from '../../component/camera/TopBar';
import { usePosts } from '../../hooks/usePosts';
import { convertPostsToFeedItems, FeedItem } from '../../utils/postUtils';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchProfile } from '../../redux/profileSlice';

const { width, height } = Dimensions.get('window');

type FeedScreenProps = {
  navigation: any;
}

const FeedScreen = ({ navigation } : FeedScreenProps) => {
  const { posts, loading, error, refreshing, refreshPosts } = usePosts();
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { data: profileData, status: profileStatus } = useSelector((state: RootState) => state.profile);

  // Convert API data to feed items
  React.useEffect(() => {
    if (posts.length > 0) {
      const convertedData = convertPostsToFeedItems(posts);
      setFeedData(convertedData);
    }
  }, [posts]);

  React.useEffect(() => {
    if (profileStatus === 'idle') {
      dispatch(fetchProfile());
    }
  }, [profileStatus, dispatch]);

  const handleProfilePress = () => {
    navigation?.navigate('ProfileScreen');
  };

  const handleCenterPress = () => {
    console.log('Center button pressed');
  };

  const handleMessagePress = () => {
    navigation?.navigate('ChatHistory');
  };

  const renderFeedItem = ({ item } : {item: FeedItem}) => (
    <View style={styles.feedItem}>
      {/* Main image container with rounded corners */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.feedImage}
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

      {/* Message input area */}
      <View style={styles.messageInputArea}>
        <TouchableOpacity style={styles.messageInput}>
          <Text style={styles.messageInputPlaceholder}>Gửi tin nhắn...</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emojiButton}>
          <Text style={styles.emoji}>💛</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emojiButton}>
          <Text style={styles.emoji}>🔥</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emojiButton}>
          <Text style={styles.emoji}>😂</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emojiButton}>
          <Text style={styles.emoji}>😍</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Chưa có bài viết nào</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refreshPosts}>
        <Text style={styles.retryButtonText}>Thử lại</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.errorText}>Có lỗi xảy ra: {error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refreshPosts}>
        <Text style={styles.retryButtonText}>Thử lại</Text>
      </TouchableOpacity>
    </View>
  );

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

      <FlatList
        data={feedData}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - 200}
        decelerationRate="fast"
        style={styles.feedList}
        contentContainerStyle={feedData.length === 0 ? styles.emptyContentContainer : styles.feedListContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPosts}
            tintColor="#FFD700"
            colors={['#FFD700']}
          />
        }
        ListEmptyComponent={error ? renderErrorComponent : renderEmptyComponent}
      />

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

        <TouchableOpacity style={styles.cameraButton}>
          <View style={styles.cameraButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <View style={styles.moreIcon}>
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  feedList: {
    flex: 1,
  },
  feedListContainer: {
    paddingBottom: 100, // Space for bottom nav
  },
  emptyContentContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  feedItem: {
    width: width,
    height: height - 80, // Space for topbar and bottom nav
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
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
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  userInfoOverlay: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 24,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  timestamp: {
    color: '#666',
    fontSize: 14,
    opacity: 0.8,
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
  // Loading and Error States
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  // Bottom Navigation Styles
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
    borderColor: '#FFD700', // Gold border like in image
  },
  cameraButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  // Grid icon (4 dots)
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
  topLeft: { top: 0, left: 0 },
  topRight: { top: 0, right: 0 },
  bottomLeft: { bottom: 0, left: 0 },
  bottomRight: { bottom: 0, right: 0 },
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
});

export default FeedScreen;