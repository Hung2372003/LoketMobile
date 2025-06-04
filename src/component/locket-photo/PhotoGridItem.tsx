import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type PhotoGridItemProps = {
  photo: any;
  width: any;
  onPress?: () => void;
  style?: any;
}

const PhotoGridItem = ({ photo, width, onPress, style } : PhotoGridItemProps) => {
  const itemHeight = width * 1.3;

  return (
    <TouchableOpacity
      style={[styles.container, { width, height: itemHeight }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: photo.uri }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Overlay for better visual effect */}
      <View style={styles.overlay} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default PhotoGridItem;