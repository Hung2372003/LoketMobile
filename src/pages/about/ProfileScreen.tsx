import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ProfileHeader from '../../component/about/ProfileHeader.tsx';
import MenuSection from '../../component/about/MenuSection.tsx';
import { MenuSectionType } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store'; // Giả sử store ở thư mục redux
import { fetchProfile, resetProfile, updateProfileName, uploadAvatar } from '../../redux/profileSlice'; // Import các actions
import { launchImageLibrary } from 'react-native-image-picker'; // Thư viện chọn ảnh cho RN CLI
import { Text } from 'react-native-gesture-handler';
import userService from '../../services/userService.ts';
import storage from '../../api/storage'

interface ProfileScreenProps {
  navigation: any; // Replace with proper navigation type
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation })  => {
  const dispatch = useDispatch<AppDispatch>();

  // Lấy dữ liệu và trạng thái từ Redux store
  const { data: profileData, status, error, isUploadingAvatar } = useSelector((state: RootState) => state.profile);

  // Vẫn dùng useState cho các state chỉ thuộc về giao diện của màn hình này
  const [convenientMode, setConvenientMode] = useState(true);
  const [newName, setNewName] = useState('');
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Chỉ gọi API để fetch profile nếu trạng thái là 'idle' (chưa được tải lần nào)
      // hoặc 'failed' (lần tải trước bị lỗi) để thử lại.
      if (status === 'idle' || status === 'failed') {
        dispatch(fetchProfile());
      }
    }, [status, dispatch])
  );

  // --- BƯỚC 4: TRIỂN KHAI HÀM `handleEditPhoto` ĐỂ UPLOAD AVATAR ---
  const handleEditPhoto = () => {
    launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
    }, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.errorCode) {
            Alert.alert('Lỗi', response.errorMessage || 'Không thể chọn ảnh');
        } else if (response.assets && response.assets[0].uri) {
            const imageUri = response.assets[0].uri;
            // Dispatch action `uploadAvatar` với URI của ảnh đã chọn
            dispatch(uploadAvatar(imageUri))
                .unwrap() // .unwrap() giúp bắt lỗi từ createAsyncThunk
                .catch(err => Alert.alert('Lỗi', err.message || 'Cập nhật ảnh thất bại.'));
        }
    });
  };

const handleEditName = () => {
    if (!newName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên mới.');
      return;
    }

    Alert.alert(
      'Xác nhận',
      `Bạn có muốn cập nhật tên thành "${newName}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Cập nhật',
          onPress: async () => {
            try {
              await dispatch(updateProfileName(newName)).unwrap();
              setNewName('');
              setIsEditNameModalVisible(false);
              Alert.alert('Thành công', 'Tên đã được cập nhật.');
            } catch (err: any) {
              Alert.alert('Lỗi', err.message || 'Cập nhật tên thất bại.');
            }
          },
        },
      ]
    );
  };

  const handleShareLocket = () => {
    // Share locket functionality
    console.log('Share locket pressed');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogout = async () => {
    try {
      await userService.logout();
      console.log('User has been logged out.');
      await storage.clearTokens();
      await storage.clearUserId();
      dispatch(resetProfile());
      navigation.navigate('HomeRegister');
    } catch (error: any) {
      Alert.alert('Lỗi', `Đăng xuất không thành công: ${error.message || 'Không rõ nguyên nhân.'}`);
    }
  };

  const menuSections: MenuSectionType[] = [
    {
      title: 'Thiết lập Tiện ích',
      items: [
        {
          id: '1',
          title: 'Thêm Tiện ích',
          icon: '+',
          onPress: () => console.log('Add widget'),
        },
        {
          id: '2',
          title: 'Cách thêm tiện ích',
          icon: '?',
          onPress: () => console.log('How to add widget'),
        },
        {
          id: '3',
          title: 'Chuỗi trên tiện ích',
          icon: '🏠',
          onPress: () => setConvenientMode(!convenientMode),
          isToggle: true,
          isToggled: convenientMode,
        },
      ],
    },
    {
      title: 'Tổng quát',
      items: [
        {
          id: '4',
          title: 'Sửa tên',
          icon: '👤',
          onPress: () => setIsEditNameModalVisible(true),
        },
        {
          id: '5',
          title: 'Thay đổi số điện thoại',
          icon: '📞',
          onPress: () => console.log('Change phone'),
        },
        {
          id: '6',
          title: 'Thay đổi địa chỉ email',
          icon: '✉️',
          onPress: () => console.log('Change email'),
        },
      ],
    },
    {
      title: 'Hỗ trợ',
      items: [
        {
          id: '7',
          title: 'Gửi đề xuất',
          icon: '+',
          onPress: () => console.log('Send suggestion'),
        },
        {
          id: '8',
          title: 'Báo cáo sự cố',
          icon: '!',
          onPress: () => console.log('Report issue'),
        },
      ],
    },
    {
      title: 'Riêng tư & bảo mật',
      items: [
        {
          id: '9',
          title: 'Hiển thị tài khoản',
          icon: '👁',
          onPress: () => console.log('Show account'),
        },
      ],
    },
    {
      title: 'Giới thiệu',
      items: [
        {
          id: '10',
          title: 'TikTok',
          icon: '🎵',
          onPress: () => console.log('TikTok'),
        },
        {
          id: '11',
          title: 'Instagram',
          icon: '📷',
          onPress: () => console.log('Instagram'),
        },
        {
          id: '12',
          title: 'X (Twitter)',
          icon: '🐦',
          onPress: () => console.log('Twitter'),
        },
        {
          id: '13',
          title: 'Chia sẻ Locket',
          icon: '🔗',
          onPress: () => console.log('Share Locket'),
        },
        {
          id: '14',
          title: 'Đánh giá Locket',
          icon: '⭐',
          onPress: () => console.log('Rate Locket'),
        },
        {
          id: '15',
          title: 'Điều khoản dịch vụ',
          icon: '📄',
          onPress: () => console.log('Terms of service'),
        },
        {
          id: '16',
          title: 'Chính sách quyền riêng tư',
          icon: '🔒',
          onPress: () => console.log('Privacy policy'),
        },
      ],
    },
    {
      title: 'Vùng nguy hiểm',
      items: [
        {
          id: '17',
          title: 'Xóa tài khoản',
          icon: '🗑',
          onPress: () => {
            Alert.alert(
              'Xóa tài khoản',
              'Bạn có chắc chắn muốn xóa tài khoản không?',
              [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', style: 'destructive' },
              ]
            );
          },
          isDanger: true,
        },
        {
          id: '18',
          title: 'Đăng xuất',
          icon: '👋',
          onPress: () => {
            Alert.alert(
              'Đăng xuất',
              'Bạn có chắc chắn muốn đăng xuất không?',
              [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng xuất',
                  style: 'destructive',
                  onPress: handleLogout,
                },
              ]
            );
          },
        },
      ],
    },
  ];

  if (status === 'idle' || status === 'loading') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <ActivityIndicator size="large" color="#ffb700" />
      </View>
    );
  }
  
  // Hiển thị lỗi nếu fetch thất bại
  if (status === 'failed') {
      return <View style={styles.container}><Text style={styles.errorText}>Lỗi: {error}</Text></View>
  }

  // if (isLoading) {
  //   return (
  //     <View style={[styles.container, styles.centerContent]}>
  //       <StatusBar barStyle="light-content" backgroundColor="#000000" />
  //       <ActivityIndicator size="large" color="#ffb700" />
  //     </View>
  //   );
  // }

  // Hiển thị lỗi nếu fetch thất bại
  if (status === 'failed') {
      return <View style={styles.container}><Text style={styles.errorText}>Lỗi: {error}</Text></View>;
  }

  // if (isLoading) {
  //   return (
  //     <View style={[styles.container, styles.centerContent]}>
  //       <StatusBar barStyle="light-content" backgroundColor="#000000" />
  //       <ActivityIndicator size="large" color="#ffb700" />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {profileData && (
          <ProfileHeader
            name={profileData.name}
            profileImage={profileData.profileImage}
            locketUrl={profileData.locketUrl}
            onEditPhoto={handleEditPhoto}
            onShareLocket={handleShareLocket}
            isUploading={isUploadingAvatar}
            onBack={handleBack}
          />
        )}

        {menuSections.map((section, index) => (
          <MenuSection
            key={index}
            title={section.title}
            items={section.items}
          />
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <Modal
        visible={isEditNameModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditNameModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sửa tên của bạn</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Nhập tên mới"
              placeholderTextColor="#999"
              autoFocus={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsEditNameModalVisible(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEditName}
              >
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacer: {
    height: 50,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: '50%',
  },modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1a1a1a', // Nền tối
    padding: 20,
    borderRadius: 40,
    width: '85%',
    elevation: 10, // Hiệu ứng bóng trên Android
    shadowColor: '#000', // Hiệu ứng bóng trên iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 18,
    padding: 12,
    marginBottom: 20,
    color: '#ffffff',
    backgroundColor: '#2d2d2d', // Nền input tối
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#666666',
  },
  saveButton: {
    backgroundColor: '#ffb700',
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ProfileScreen;