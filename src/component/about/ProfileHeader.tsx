import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

interface ProfileHeaderProps {
  name: string;
  profileImage: string;
  locketUrl: string;
  onEditPhoto: () => void;
  onShareLocket: () => void;
  isUploading?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
                                                       name,
                                                       profileImage,
                                                       locketUrl,
                                                       onEditPhoto,
                                                       onShareLocket,
                                                       isUploading,
                                                     }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          {isUploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="#FFFFFF" />
          </View>
          )}
        </View>
        <Text style={styles.nameText}>{name}</Text>
        <TouchableOpacity onPress={onEditPhoto} disabled={isUploading}>
          <Text style={styles.editPhotoText}>Edit Photo</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.locketCard} onPress={onShareLocket}>
        <View style={styles.locketContent}>
          <View style={styles.locketLeft}>
            <Image source={{ uri: profileImage }} style={styles.locketAvatar} />
            <View>
              <Text style={styles.locketTitle}>Mời bạn bè tham gia Locket!</Text>
              <Text style={styles.locketUrl}>{locketUrl}</Text>
            </View>
          </View>
          <View style={styles.shareIcon}>
            <Text style={styles.shareIconText}>⤴</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFA500',
    padding: 3,
    marginBottom: 15,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 57,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  editPhotoText: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: '500',
  },
  locketCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
  },
  locketContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locketLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locketAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  locketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  locketUrl: {
    fontSize: 14,
    color: '#8E8E93',
  },
  shareIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIconText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Phủ lên toàn bộ component cha
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60, // Giữ cho hình tròn giống avatar
  },
});

export default ProfileHeader;