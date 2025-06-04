import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import PhotoGridItem from '../../component/locket-photo/PhotoGridItem';
import FloatingCaptureButton from '../../component/locket-photo/FloatingCaptureButton';
import TopBar from '../../component/camera/TopBar';

type Photo = {
  id: string;
  uri: string;
  type: string;
};

type ListPhotoScreenProps = {
  photos?: Photo[];
  onCapturePress?: () => void;
  onPhotoPress?: (photo: Photo) => void;
  navigation: any;
};

const { width: screenWidth } = Dimensions.get('window');
const ITEM_MARGIN = 4;
const ITEMS_PER_ROW = 3;
const ITEM_WIDTH = (screenWidth - (ITEM_MARGIN * (ITEMS_PER_ROW + 1))) / ITEMS_PER_ROW;

const mockPhotos = [
  { id: '1', uri: 'https://picsum.photos/300/400?random=1', type: 'image' },
  { id: '2', uri: 'https://picsum.photos/300/400?random=2', type: 'image' },
  { id: '3', uri: 'https://picsum.photos/300/400?random=3', type: 'image' },
  { id: '4', uri: 'https://picsum.photos/300/400?random=4', type: 'image' },
  { id: '5', uri: 'https://picsum.photos/300/400?random=5', type: 'image' },
  { id: '6', uri: 'https://picsum.photos/300/400?random=6', type: 'image' },
  { id: '7', uri: 'https://picsum.photos/300/400?random=7', type: 'image' },
  { id: '8', uri: 'https://picsum.photos/300/400?random=8', type: 'image' },
  { id: '9', uri: 'https://picsum.photos/300/400?random=9', type: 'image' },
  { id: '10', uri: 'https://picsum.photos/300/400?random=10', type: 'image' },
  { id: '11', uri: 'https://picsum.photos/300/400?random=11', type: 'image' },
  { id: '12', uri: 'https://picsum.photos/300/400?random=12', type: 'image' },
];



const ListPhotoScreen: React.FC<ListPhotoScreenProps> = ({photos = mockPhotos, onCapturePress, onPhotoPress, navigation}) => {
  const handleProfilePress = () => {
    navigation?.navigate('ProfileScreen');
  };

  const handleCenterPress = () => {
    // navigation?.navigate('CenterScreen');
  };

  const handleMessagePress = () => {
    navigation?.navigate('ChatHistory');
  };

  const renderPhotoGrid = () => {
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
              onPress={() => onPhotoPress?.(photo)}
              style={[
                styles.gridItem,
                index > 0 && styles.gridItemWithMargin,
              ]}
            />
          ))}
          {/* Fill empty space if row is not complete */}
          {rowItems.length < ITEMS_PER_ROW && (
            <View style={[styles.emptyItem, { width: ITEM_WIDTH }]} />
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <TopBar
          centerText="Tất cả bạn bè"
          showDropdown={true}
          notificationCount={3}
          onProfilePress={handleProfilePress}
          onCenterPress={handleCenterPress}
          onMessagePress={handleMessagePress}
          mode="feed"
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderPhotoGrid()}
      </ScrollView>

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
    paddingTop: 150,
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
});

export default ListPhotoScreen;