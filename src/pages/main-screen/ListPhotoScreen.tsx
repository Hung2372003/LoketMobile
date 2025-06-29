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
} from 'react-native';
import PhotoGridItem from '../../component/locket-photo/PhotoGridItem';
import FloatingCaptureButton from '../../component/locket-photo/FloatingCaptureButton';
import TopBar from '../../component/camera/TopBar';
import { usePosts } from '../../hooks/usePosts';
import { convertPostsToPhotos, PhotoItem, getPhotoStats } from '../../utils/photoUtils';

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

  // Convert posts to photos array
  useEffect(() => {
    if (posts.length > 0) {
      const convertedPhotos = convertPostsToPhotos(posts);
      setPhotos(convertedPhotos);
    } else {
      setPhotos([]);
    }
  }, [posts]);

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
    console.log('Photo pressed:', photo);
    onPhotoPress?.(photo);
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
          {/* Fill empty space if row is not complete */}
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
            ))
          }
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
        <View style={styles.photoCountContainer}>
          <Text style={styles.photoCountText}>
            {photos.length} ảnh{photos.length > 0 && ` từ ${getPhotoStats(photos).uniquePosts} bài viết`}
          </Text>
        </View>
        {renderPhotoGrid()}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar
        centerText="Tất cả ảnh"
        showDropdown={false}
        notificationCount={3}
        onProfilePress={handleProfilePress}
        onCenterPress={handleCenterPress}
        onMessagePress={handleMessagePress}
        mode="feed"
      />

      {renderContent()}

      <FloatingCaptureButton onPress={onCapturePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: ITEM_MARGIN,
    paddingBottom: 100,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: ITEM_MARGIN,
  },
  gridItem: {
    flex: 1,
  },
  gridItemWithMargin: {
    marginLeft: ITEM_MARGIN,
  },
  emptyItem: {
    flex: 1,
  },
  // Photo count
  photoCountContainer: {
    marginTop: ITEM_MARGIN,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  photoCountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
  },
  // Loading, Empty, and Error States
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100, // Account for floating button
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
    opacity: 0.8,
  },
  // Empty State
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  // Error State
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    color: '#ff6b6b',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorDescription: {
    color: '#ff6b6b',
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  // Retry Button
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ListPhotoScreen;