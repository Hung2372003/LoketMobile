import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { Friend } from '../../types/camera';
import Feather from '@react-native-vector-icons/feather';
import friendService from '../../services/friendService';

interface TopBarProps {
  friends?: Friend[];
  notificationCount: number;
  onProfilePress: () => void;
  onMessagePress: () => void;
  // Props mới để customize
  mode?: 'camera' | 'feed';
  centerText?: string;
  showDropdown?: boolean;
  onCenterPress?: () => void;
  profileImage?: string ;
}



const TopBar: React.FC<TopBarProps> = ({
                                         friends= [],
                                         notificationCount,
                                         onProfilePress,
                                         onMessagePress,
                                         mode = 'camera',
                                         showDropdown = false,
                                         onCenterPress,
                                         profileImage,
                                       }) => {
  const friendCount = friends.length;

  const getCenterText = () => {
    // if (centerText) return centerText;
    if (mode === 'feed') return 'Tất cả bạn bè';
    return `${friendCount} Bạn bè`;
  };

  const renderCenterSection = () => {
    if (mode === 'feed') {
      return (
        <TouchableOpacity
          style={styles.centerButton}
          onPress={onCenterPress}
          disabled={!onCenterPress}
        >
          <Text style={styles.centerText}>{getCenterText()}</Text>
          {showDropdown && (
            // <Text style={styles.dropdownIcon}>▼</Text>
            <Feather name="chevron-down" size={22} color={'#FFF'}/>
          )}
        </TouchableOpacity>
      );
    }

    // Mode camera (default)
    return (
      <TouchableOpacity style={styles.friendsButton} onPress={onCenterPress}>
        <View style={styles.friendsIcon}>
          {/*<Text style={styles.friendsIconText}>👥</Text>*/}
          <Feather name="user-x" style={styles.friendsIcon} />
        </View>
        <Text style={styles.friendsText}>{getCenterText()}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.container}>
        <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <View style={styles.centerSection}>
          {renderCenterSection()}
        </View>

        <TouchableOpacity style={styles.messageButton} onPress={onMessagePress}>
          <View style={styles.messageIcon}>
            <Feather name="message-circle" size={24} color="#FFF" />

            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </View>

        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  // Style cho camera mode
  friendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  friendsIcon: {
    marginRight: 8,
    color: '#FFF',
    fontSize: 16,
  },
  friendsIconText: {
    fontSize: 16,
  },
  friendsText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
  },
  // Style cho feed mode
  centerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 160,
    justifyContent: 'center',
  },
  centerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownIcon: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 8,
    opacity: 0.8,
  },
  messageButton: {
    position: 'relative',
  },
  messageIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'FFF',
  },
  messageIconText: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TopBar;