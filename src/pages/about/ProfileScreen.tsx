import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ProfileHeader from '../../component/about/ProfileHeader.tsx';
import MenuSection from '../../component/about/MenuSection.tsx';
import { MenuSectionType } from '../../types';
import userService from '../../services/userService.ts';
import { Profile } from '../../types/profile.ts';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {
  const [convenientMode, setConvenientMode] = useState(true);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          const profileFromApi = await userService.getMyProfile();

          if (profileFromApi) {
            const mappedProfile: Profile = {
              name: profileFromApi.name,
              profileImage: profileFromApi.avatar,
              locketUrl: profileFromApi.email,
            };
            setProfileData(mappedProfile);
          } else {
            throw new Error('Không nhận được dữ liệu profile.');
          }

        } catch (error: any) {
          Alert.alert('Lỗi', error.message || 'Không thể tải thông tin cá nhân.');
        } finally {
          setIsLoading(false);
        }
      };

      setIsLoading(true);
      fetchProfile();
    }, [])
  );

  const handleEditPhoto = () => {
    // Navigate to photo editing screen
    console.log('Edit photo pressed');
  };

  const handleShareLocket = () => {
    // Share locket functionality
    console.log('Share locket pressed');
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
          onPress: () => console.log('Edit name'),
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
                { text: 'Đăng xuất', style: 'destructive' },
              ]
            );
          },
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <ActivityIndicator size="large" color="#ffb700" />
      </View>
    );
  }

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
});

export default ProfileScreen;