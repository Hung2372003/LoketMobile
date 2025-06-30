import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import PhotoGridItem from '../../component/locket-photo/PhotoGridItem';
import TopBar from '../../component/camera/TopBar';
import { usePosts } from '../../hooks/usePosts';
import { convertPostsToPhotos, PhotoItem, getPhotoStats } from '../../utils/photoUtils';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchProfile } from '../../redux/profileSlice';

type ListPhotoScreenProps = {
  onCapturePress?: () => void;
  onPhotoPress?: (photo: PhotoItem) => void;
  navigation: any;
};

const { width: screenWidth } = Dimensions.get('window');
const ITEM_MARGIN = 4;
const ITEMS_PER_ROW = 3;
const ITEM_WIDTH = (screenWidth - (ITEM_MARGIN * (ITEMS_PER_ROW + 1))) / ITEMS_PER_ROW;

const ListPhotoScreen: React.FC<ListPhotoScreenProps> = ({
                                                           onCapturePress,
                                                           onPhotoPress,
                                                           navigation
                                                         }) => {
  const { posts, loading, error, refreshing, refreshPosts } = usePosts();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { data: profileData, status: profileStatus } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (posts.length > 0) {
      const convertedPhotos = convertPostsToPhotos(posts);
      setPhotos(convertedPhotos);
    } else {
      setPhotos([]);
    }
  }, [posts]);

  useEffect(() => {
    if (profileStatus === 'idle') {
      dispatch(fetchProfile());
    }
  }, [profileStatus, dispatch]);

  const handleProfilePress = () => {
    navigation?.navigate('ProfileScreen');
  };

  const handleCenterPress = () => {
    // navigation?.navigate('CenterScreen');
  };

  const handleMessagePress = () => {
    navigation?.navigate('ChatHistory');
  };

  const handlePhotoPress = (photo: PhotoItem) => {
    navigation.navigate('FeedScreen', {selectedPhotoId: photo.id});
  };

  const renderPhotoGrid = () => {
    if (photos.length === 0) {
      return null;
    }

    const rows = [];
    for (let i = 0; i < photos.length; i += ITEMS_PER_ROW) {
      const rowItems = photos.slice(i, i + ITEMS_PER_ROW);
      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {rowItems.map((photo, index) => (
            <PhotoGridItem
              key={photo.id}
              photo={photo}
              width={ITEM_WIDTH}
              onPress={() => handlePhotoPress(photo)}
              style={[
                styles.gridItem,
                index > 0 && styles.gridItemWithMargin,
              ]}
            />
          ))}
          {rowItems.length < ITEMS_PER_ROW &&
            Array.from({ length: ITEMS_PER_ROW - rowItems.length }).map((_, emptyIndex) => (
              <View
                key={`empty-${i}-${emptyIndex}`}
                style={[
                  styles.emptyItem,
                  { width: ITEM_WIDTH },
                  emptyIndex === 0 && rowItems.length > 0 && styles.gridItemWithMargin
                ]}
              />
            ))}
        </View>
      );
    }
    return rows;
  };

  const renderLoadingState = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#FFD700" />
      <Text style={styles.loadingText}>Đang tải ảnh...</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyIcon}>📷</Text>
      <Text style={styles.emptyTitle}>Chưa có ảnh nào</Text>
      <Text style={styles.emptyDescription}>
        Các ảnh từ bài viết sẽ hiển thị ở đây
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={refreshPosts}>
        <Text style={styles.retryButtonText}>Làm mới</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
      <Text style={styles.errorDescription}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refreshPosts}>
        <Text style={styles.retryButtonText}>Thử lại</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (loading && photos.length === 0) {
      return renderLoadingState();
    }

    if (error && photos.length === 0) {
      return renderErrorState();
    }

    if (photos.length === 0) {
      return renderEmptyState();
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPosts}
            tintColor="#FFD700"
            colors={['#FFD700']}
          />
        }
      >
        {renderPhotoGrid()}
      </ScrollView>

    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        centerText="Tất cả ảnh"
        showDropdown={false}
        notificationCount={3}
        onProfilePress={handleProfilePress}
        onCenterPress={handleCenterPress}
        onMessagePress={handleMessagePress}
        mode="feed"
        profileImage={profileData?.profileImage}
      />

      <View style={styles.contentContainer}>
        {renderContent()}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={onCapturePress}
        >
          <View style={styles.cameraButtonInner} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  contentContainer: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: ITEM_MARGIN, paddingBottom: 140, paddingTop: 140 },
  row: { flexDirection: 'row', marginBottom: ITEM_MARGIN },
  gridItem: { flex: 1 },
  gridItemWithMargin: { marginLeft: ITEM_MARGIN },
  emptyItem: { flex: 1 },
  // Loading, Empty, and Error States
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  loadingText: { color: '#fff', fontSize: 16, marginTop: 15, opacity: 0.8 },
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyTitle: { color: '#fff', fontSize: 24, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  emptyDescription: { color: '#fff', fontSize: 16, opacity: 0.7, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  errorIcon: { fontSize: 64, marginBottom: 20 },
  errorTitle: { color: '#ff6b6b', fontSize: 24, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  errorDescription: { color: '#ff6b6b', fontSize: 16, opacity: 0.8, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  retryButton: { backgroundColor: '#FFD700', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, elevation: 3, shadowColor: '#FFD700', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  retryButtonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', paddingBottom: 20 },
  cameraButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFD700' },
  cameraButtonInner: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff' },
});

export default ListPhotoScreen;