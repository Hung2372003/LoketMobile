import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import ProfileHeader from '../../component/about/ProfileHeader.tsx';
import MenuSection from '../../component/about/MenuSection.tsx';
import { MenuSectionType } from '../../types';
import userService from '../../services/userService.ts';

const ProfileScreen: React.FC = () => {
  const [convenientMode, setConvenientMode] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    profileImage: '',
    locketUrl: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await userService.getMyProfile();
        setProfileData({
          name: profile.name,
          profileImage: profile.avatar,
          locketUrl: profile.email,
        });
      } catch (error: any) {
        Alert.alert('Lỗi', error.message || 'Không thể tải thông tin cá nhân.');
      }
    };
    fetchProfile();
  }, []);

  // Mock data - thay thế bằng data thực tế
  // const profileData = {
  //   name: 'Huy Phúc',
  //   profileImage: 'https://via.placeholder.com/120',
  //   locketUrl: 'locket.cam/nhp_2805',
  // };

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name={profileData.name}
          profileImage={profileData.profileImage}
          locketUrl={profileData.locketUrl}
          onEditPhoto={handleEditPhoto}
          onShareLocket={handleShareLocket}
        />

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
});

export default ProfileScreen;