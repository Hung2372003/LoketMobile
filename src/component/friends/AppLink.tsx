// src/components/features/friends/AppLink.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { AppLinkData } from '../../types/friend'; // Import type

interface AppLinkProps extends AppLinkData {
  onPress?: () => void;
}

const AppLink: React.FC<AppLinkProps> = ({
  appName,
  iconColor,
  isImage,
  imageSource,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.appLink} onPress={onPress}>
      {isImage && imageSource ? (
        <Image source={imageSource as ImageSourcePropType} style={[styles.appIconImage, { tintColor: iconColor }]} />
      ) : (
        <View style={[styles.appIconBackground, { backgroundColor: iconColor || '#4A4A4A' }]}>
          <Feather name={'share-2'} size={24} color="#FFFFFF"/>
        </View>
      )}
      <Text style={styles.appNameText}>{appName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  appLink: {
    alignItems: 'center',
    width: 75,
    marginHorizontal: 5,
  },
  appIconBackground: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appIconImage: {
    width: 56,
    height: 56,
    borderRadius: 27,
    marginBottom: 8,
  },
  appNameText: {
    color: '#d8d8e0',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default AppLink;