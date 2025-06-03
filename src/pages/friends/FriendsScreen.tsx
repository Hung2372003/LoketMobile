import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  StatusBar,
  // ImageSourcePropType, // không cần nếu avatar đã được typed trong Friend
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Imports từ cấu trúc mới
import FriendItem from '../../component/friends/FriendItem';
import AppLink from '../../component/friends/AppLink';
import SearchBarFriends from '../../component/friends/SearchBarFriends';
import { Friend, AppLinkData } from '../../types/friend';
import { colors, typography, spacing } from './friend.style'; // Theme
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigation';
import { useNavigation } from '@react-navigation/native';

type FriendsScreenProps = NativeStackNavigationProp<RootStackParamList, 'FriendsScreen'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PULL_THRESHOLD = SCREEN_HEIGHT * 0.25;
const ANIMATION_DURATION_OUT = 300;
const ANIMATION_DURATION_BACK = 200;

// Mock data (nên đặt ở một file riêng nếu lớn hoặc lấy từ API)
const MOCK_FRIENDS_DATA: Friend[] = [
  { id: '1', name: 'Chiem Pham', avatar: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/135bfa79-b0f9-4ca9-95ba-b81f8f61c8ab/dhsxvbo-55be135b-4d19-406a-a79f-34e7c7840272.png/v1/fill/w_1280,h_1280/toon_link_in_my_avatar_style_by_bluetoad_10_dhsxvbo-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzEzNWJmYTc5LWIwZjktNGNhOS05NWJhLWI4MWY4ZjYxYzhhYlwvZGhzeHZiby01NWJlMTM1Yi00ZDE5LTQwNmEtYTc5Zi0zNGU3Yzc4NDAyNzIucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.FpqAbQIQv3qLMIKR0GbzniJ0jWdeknJwT9bvP0GWFFE' },
  { id: '2', name: 'Huy Phuc', avatar: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/135bfa79-b0f9-4ca9-95ba-b81f8f61c8ab/dhsxvbo-55be135b-4d19-406a-a79f-34e7c7840272.png/v1/fill/w_1280,h_1280/toon_link_in_my_avatar_style_by_bluetoad_10_dhsxvbo-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzEzNWJmYTc5LWIwZjktNGNhOS05NWJhLWI4MWY4ZjYxYzhhYlwvZGhzeHZiby01NWJlMTM1Yi00ZDE5LTQwNmEtYTc5Zi0zNGU3Yzc4NDAyNzIucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.FpqAbQIQv3qLMIKR0GbzniJ0jWdeknJwT9bvP0GWFFE' },
  { id: '3', name: 'Hung Van', avatar: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/135bfa79-b0f9-4ca9-95ba-b81f8f61c8ab/dhsxvbo-55be135b-4d19-406a-a79f-34e7c7840272.png/v1/fill/w_1280,h_1280/toon_link_in_my_avatar_style_by_bluetoad_10_dhsxvbo-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcLzEzNWJmYTc5LWIwZjktNGNhOS05NWJhLWI4MWY4ZjYxYzhhYlwvZGhzeHZiby01NWJlMTM1Yi00ZDE5LTQwNmEtYTc5Zi0zNGU3Yzc4NDAyNzIucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.FpqAbQIQv3qLMIKR0GbzniJ0jWdeknJwT9bvP0GWFFE' },
];

const MOCK_APP_LINKS_DATA: AppLinkData[] = [
  { id: 'app1', appName: 'Messenger', isImage: true, imageSource: require('../../assets/logo_locket.png'), iconColor: colors.messengerBlue }, // Sử dụng màu từ theme
  { id: 'app2', appName: 'Zalo', isImage: true, imageSource: require('../../assets/logo_locket.png'), iconColor: colors.zaloBlue },
  { id: 'app3', appName: 'Insta', isImage: true, imageSource: require('../../assets/logo_locket.png'), iconColor: colors.instagramPink },
  { id: 'app4', appName: 'Khác', iconName: 'share-social-outline', iconColor: colors.iconDefault },
];



const FriendsScreen: React.FC = () => {
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [isAtTop, setIsAtTop] = useState(true);
  const [searchText, setSearchText] = useState('');
   const navigation = useNavigation<FriendsScreenProps>();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => isAtTop && gestureState.dy > 5,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
          const newOpacity = 1 - (gestureState.dy / (PULL_THRESHOLD * 1.5));
          opacity.setValue(Math.max(0, newOpacity));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        if (gestureState.dy > PULL_THRESHOLD) {
          Animated.parallel([
            Animated.timing(pan.y, {
              toValue: SCREEN_HEIGHT * 0.5,
              duration: ANIMATION_DURATION_OUT,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: ANIMATION_DURATION_OUT,
              useNativeDriver: true,
            }),
          ]).start(() => {
            navigation.navigate('FeedScreen');
          });
        } else {
          Animated.parallel([
            Animated.spring(pan.y, {
              toValue: 0,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: ANIMATION_DURATION_BACK,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: number } } }) => {
    setIsAtTop(event.nativeEvent.contentOffset.y === 0);
  };

  const handleRemoveFriend = (id: string) => {
    console.log('Remove friend with id:', id);
    // Thêm logic xóa bạn ở đây
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Animated.View
      style={[
        styles.animatedContainer,
        {
          opacity: opacity,
          transform: [{ translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
      >
        {/* Thanh kéo trực quan */}
        <View style={styles.pullDownHandleContainer}>
          <View style={styles.pullDownHandle} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Bạn bè của bạn</Text>
            <Text style={styles.subtitle}>4 / 20 người bạn đã được bổ sung</Text>
          </View>

          <SearchBarFriends value={searchText} onChangeText={setSearchText} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tìm bạn bè từ các ứng dụng khác</Text>
            <View style={styles.appLinksContainer}>
              {MOCK_APP_LINKS_DATA.map(app => (
                <AppLink key={app.id} {...app} onPress={() => console.log(`Open ${app.appName}`)}/>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bạn bè của bạn</Text>
            {MOCK_FRIENDS_DATA.map(friend => (
              <FriendItem
                key={friend.id}
                {...friend}
                onRemove={handleRemoveFriend}
              />
            ))}
          </View>

          {/* <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>Xem thêm</Text>
            <Icon name="chevron-down-outline" size={18} color={colors.secondaryText} />
          </TouchableOpacity> */}

          {/* Khoảng trống ở cuối để có thể kéo qua ngưỡng dễ dàng hơn */}
          <View style={{ height: PULL_THRESHOLD * 1.5 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  animatedContainer: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  pullDownHandleContainer: {
    paddingTop: spacing.medium, // Khoảng cách từ đỉnh màn hình tới thanh kéo
    paddingBottom: spacing.small, // Khoảng cách dưới thanh kéo
    alignItems: 'center',
    // backgroundColor: colors.background, // Cùng màu nền để hòa hợp
  },
  pullDownHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.tertiaryText,
  },
  scrollView: {
    flex: 1, // Để ScrollView chiếm không gian còn lại
  },
  scrollViewContent: {
    paddingHorizontal: spacing.large,
    paddingTop: spacing.small, // Nội dung bắt đầu ngay dưới thanh kéo (hoặc 0 nếu thanh kéo đã có paddingBottom)
    paddingBottom: spacing.large,
  },
  header: {
    marginBottom: spacing.large,
  },
  title: {
    ...typography.h1,
    color: colors.primaryText,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    fontSize: 15,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: spacing.small,
  },
  section: {
    marginBottom: spacing.large,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 18,
    color: colors.primaryText,
    marginBottom: spacing.medium,
  },
  appLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -spacing.small,
  },
  seeMoreButton: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: spacing.medium - 2,
    paddingHorizontal: spacing.large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: spacing.medium,
  },
  seeMoreText: {
    ...typography.body,
    fontWeight: '500' as '500',
    color: colors.primaryText,
    marginRight: spacing.small,
  },
});

export default FriendsScreen;