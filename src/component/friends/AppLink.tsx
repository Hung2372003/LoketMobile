// src/components/features/friends/AppLink.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppLinkData } from '../../types/friend'; // Import type

interface AppLinkProps extends AppLinkData {
  onPress?: () => void;
}

const AppLink: React.FC<AppLinkProps> = ({
  appName,
  iconName,
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
          <Icon name={iconName || 'apps-outline'} size={28} color="#FFFFFF" />
        </View>
      )}
      <Text style={styles.appNameText}>{appName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  appLink: {
    alignItems: 'center',
    width: 75, // Điều chỉnh cho phù hợp
    marginHorizontal: 5,
  },
  appIconBackground: {
    width: 56,
    height: 56,
    borderRadius: 18, // Bo tròn ít hơn cho giống Zalo, Messenger
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appIconImage: {
    width: 56,
    height: 56,
    borderRadius: 18,
    marginBottom: 8,
  },
  appNameText: {
    color: '#AEAEB2',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default AppLink;