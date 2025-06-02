import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import TopBar from '../../component/camera/TopBar';

const { width, height } = Dimensions.get('window');
type User = {
  name: string;
  avatar: string;
}
type FeedItem = {
  id: string;
  user: User;
  image: string;
  timestamp: string;
  caption?: string;
}
type FeedScreenProps = {
  navigation: any;
}

const FeedScreen = ({ navigation } : FeedScreenProps) => {
  const [feedData, setFeedData] = useState([
    {
      id: '1',
      user: {
        name: 'Bạn A',
        avatar: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/135bfa79-b0f9-4ca9-95ba-b81f8f61c8ab/dhsxvbo-55be135b-4d19-406a-a79f-34e7c7840272.png/v1/fill/w_1280,h_1280/toon_link_in_my_avatar_style_by_bluetoad_10_dhsxvbo-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzEzNWJmYTc5LWIwZjktNGNhOS05NWJhLWI4MWY4ZjYxYzhhYlwvZGhzeHZiby01NWJlMTM1Yi00ZDE5LTQwNmEtYTc5Zi0zNGU3Yzc4NDAyNzIucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.FpqAbQIQv3qLMIKR0GbzniJ0jWdeknJwT9bvP0GWFFE',
      },
      image: 'https://fifthsun.com/cdn/shop/files/19NNTD00461A-033-Link-Avatar-Color-148-147-swatch_1024x.jpg?v=1713863654',
      timestamp: 'May 18, 2025',
      caption: 'muốn lấy vợ thế nhi 🤡',
    },
    // {
    //   id: '2',
    //   user: {
    //     name: 'Bạn B',
    //     avatar: 'https://via.placeholder.com/40',
    //   },
    //   image: 'https://via.placeholder.com/400x600',
    //   timestamp: 'May 17, 2025',
    //   caption: 'Ngày đẹp trời ☀️',
    // },
  ]);

  const handleProfilePress = () => {
    navigation?.navigate('ProfileScreen');
  };

  const handleCenterPress = () => {
    console.log('Center button pressed');
  };

  const handleMessagePress = () => {
    navigation?.navigate('ChatHistory');
  };

  const renderFeedItem = ({ item } : {item: FeedItem}) => (
    <View style={styles.feedItem}>
      {/* Main image container with rounded corners */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.feedImage} />

        {item.caption && (
          <View style={styles.captionOverlay}>
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      </View>

      <View style={styles.userInfoContainer}>
        <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
        <View style={styles.userTextInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>


      {/* Message input area */}
      <View style={styles.messageInputArea}>
        <TouchableOpacity style={styles.messageInput}>
          <Text style={styles.messageInputPlaceholder}>Gửi tin nhắn...</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emojiButton}>
          <Text style={styles.emoji}>💛</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emojiButton}>
          <Text style={styles.emoji}>🔥</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emojiButton}>
          <Text style={styles.emoji}>😂</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emojiButton}>
          <Text style={styles.emoji}>😍</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        centerText="Tất cả bạn bè"
        showDropdown={true}
        notificationCount={3}
        onProfilePress={handleProfilePress}
        onCenterPress={handleCenterPress}
        onMessagePress={handleMessagePress}
        mode="feed"
      />

      <FlatList
        data={feedData}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - 200}
        decelerationRate="fast"
        style={styles.feedList}
        contentContainerStyle={styles.feedListContainer}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <View style={styles.gridIcon}>
            <View style={[styles.dot, styles.topLeft]} />
            <View style={[styles.dot, styles.topRight]} />
            <View style={[styles.dot, styles.bottomLeft]} />
            <View style={[styles.dot, styles.bottomRight]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cameraButton}>
          <View style={styles.cameraButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <View style={styles.moreIcon}>
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  feedList: {
    flex: 1,
  },
  feedListContainer: {
    paddingBottom: 100, // Space for bottom nav
  },
  feedItem: {
    width: width,
    height: height - 200, // Space for topbar and bottom nav
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  feedImage: {
    width: '100%',
    height: '65%',
    marginTop: '55%',
    alignSelf: 'center',
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  userInfoOverlay: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userTextInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 24,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },

  timestamp: {
    color: '#666',
    fontSize: 14,
    opacity: 0.8,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 20,
    left: '20%',
    right: '20%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  caption: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'center',
  },
  messageInputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
  messageInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginRight: 10,
  },
  messageInputPlaceholder: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.7,
  },
  emojiButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  emoji: {
    fontSize: 26,
  },
  // Bottom Navigation Styles
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  navButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700', // Gold border like in image
  },
  cameraButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  // Grid icon (4 dots)
  gridIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    position: 'absolute',
  },
  topLeft: { top: 0, left: 0 },
  topRight: { top: 0, right: 0 },
  bottomLeft: { bottom: 0, left: 0 },
  bottomRight: { bottom: 0, right: 0 },
  // More icon (3 dots)
  moreIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreDot: {
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    marginHorizontal: 2,
  },
});

export default FeedScreen;