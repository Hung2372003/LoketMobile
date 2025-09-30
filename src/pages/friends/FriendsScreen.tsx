import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import FriendItem from '../../component/friends/FriendItem';
import AppLink from '../../component/friends/AppLink';
import SearchBarFriends from '../../component/friends/SearchBarFriends';
import { Friend, AppLinkData, FriendRequest, SearchResult } from '../../types/friend';
import { colors, typography, spacing } from './friend.style';
import { useFocusEffect} from '@react-navigation/native';
import friendService from '../../services/friendService';
import { useSelector} from 'react-redux';
import { RootState} from '../../redux/store';
import { FirebaseManagermentApi } from '../../api/endpoint.api';

interface FriendsScreenProps {
  navigation: any; // Replace with proper navigation type
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PULL_THRESHOLD = SCREEN_HEIGHT * 0.25;
const ANIMATION_DURATION_OUT = 300;
const ANIMATION_DURATION_BACK = 200;

const MOCK_APP_LINKS_DATA: AppLinkData[] = [
  { id: 'app1', appName: 'Messenger', isImage: true, imageSource: require('../../assets/messenger.png') },
  { id: 'app2', appName: 'Zalo', isImage: true, imageSource: require('../../assets/zalo.jpg') },
  { id: 'app3', appName: 'Insta', isImage: true, imageSource: require('../../assets/instagram2.jpg')},
  { id: 'app4', appName: 'Khác', iconColor: colors.iconDefault },
];



const FriendsScreen: React.FC<FriendsScreenProps> = ({navigation}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [isAtTop, setIsAtTop] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  const currentUserName = useSelector((state: RootState) => state.profile.data?.name);

  useFocusEffect(
    useCallback(() => {
      const fetchInitialData = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const [friendsFromApi, requestsFromApi] = await Promise.all([
            friendService.getFriends(),
            friendService.getFriendRequests(),
          ]);

          // Map dữ liệu từ API sang
          const mappedFriends: Friend[] = friendsFromApi.map((friend: any) => ({
            id: String(friend.userCode),
            name: friend.name,
            avatar: friend.path,
          }));
          setFriendRequests(requestsFromApi.map((r: any) => ({ id: String(r.userCode), name: r.name, avatar: r.avatar })));

          setFriends(mappedFriends);

        } catch (err: any) {
          setError(err.message || 'Lỗi không xác định');
        } finally {
          setIsLoading(false);
        }
      };

      fetchInitialData();

      // Reset lại vị trí và độ mờ của màn hình ngay lập tức
      pan.setValue({ x: 0, y: 0 });
      opacity.setValue(1);
      // Đảm bảo trạng thái isAtTop cũng được reset nếu cần
      setIsAtTop(true);

      return () => {
        pan.stopAnimation();
        opacity.stopAnimation();
      };
    }, [pan, opacity])
  );

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
            navigation.navigate('MainScreen');
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

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const resultsFromApi = await friendService.searchFriends(text);

        // Hàm helper để "dịch" status từ API
        const mapApiStatusToLocalStatus = (apiStatus: string): SearchResult['status'] => {
          switch (apiStatus) {
            case 'ALREADY_FRIENDS':
              return 'is_friend';
            case 'WAITING_FRIENDED':
              return 'pending';
            default:
              return 'not_friend';
          }
        };

        // Map dữ liệu từ API, sử dụng status trả về
        const mappedResults: SearchResult[] = resultsFromApi.map((r: any) => ({
          id: String(r.id),
          name: r.name,
          avatar: r.avatar,
          status: mapApiStatusToLocalStatus(r.status), // <-- Sử dụng status thật từ API
        }));

        setSearchResults(mappedResults);
      } catch (err: any) {
        Alert.alert('Lỗi tìm kiếm', err.message);
      } finally {
        setIsSearching(false);
      }
    }, 500); // Chờ 500ms sau khi người dùng ngừng gõ
  };

  // --- ACTION HANDLERS ---
  const handleSendRequest = async (userId: string) => {
    if (!currentUserName) {
      Alert.alert('Lỗi', 'Không lấy được thông tin người dùng. Vui lòng thử lại.');
      return;
    }

    try {
      // 1. Gửi request lên server
      await friendService.sendFriendRequest(Number(userId));

      // 2. Gửi thông báo qua Firebase
      await FirebaseManagermentApi.senNotifMessage({
          title: 'Lời mời kết bạn mới',
          notification: `${currentUserName} đã gửi cho bạn một lời mời kết bạn.`,
          userId: userId.toString()
      });

      Alert.alert('Thành công', 'Đã gửi lời mời kết bạn.');

      // 3. Cập nhật UI
      setSearchResults(prev => prev.map(user => user.id === userId ? { ...user, status: 'pending' } : user));
    } catch (err: any) {
      Alert.alert('Lỗi', err.message);
    }
  };

  const handleAcceptRequest = async (request: FriendRequest) => {
    try {
      await friendService.acceptFriendRequest(Number(request.id));
      // Cập nhật UI ngay lập tức
      setFriendRequests(prev => prev.filter(r => r.id !== request.id));
      setFriends(prev => [...prev, { id: request.id, name: request.name, avatar: request.avatar }]);
      Alert.alert('Thành công', `Bạn và ${request.name} đã trở thành bạn bè.`);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message);
    }
  };

  const handleRejectRequest = async (friendId: string) => {
    try {

      await friendService.rejectFriend(Number(friendId));

      setFriendRequests(prev => prev.filter(r => r.id !== friendId));

    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể từ chối vào lúc này.');
    }
  };

  const handleRemoveFriend = (friendId: string) => {
    const friendToRemove = friends.find(f => f.id === friendId);
    if (!friendToRemove) return;

    Alert.alert(
      'Xóa bạn', 
      `Bạn có chắc chắn muốn xóa ${friendToRemove.name} khỏi danh sách bạn bè không?`, // Nội dung
      [
        {
          text: 'Hủy',
          style: 'cancel', 
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              await friendService.removeFriend(Number(friendId));

              setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));

            } catch (err: any) {
              Alert.alert('Lỗi', err.message || 'Không thể xóa bạn bè vào lúc này.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true } // Cho phép đóng hộp thoại bằng cách nhấn ra ngoài
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={colors.loading} style={{ marginTop: 50 }} />;
    }
    if (error) {
      return <Text style={styles.errorText}>Lỗi: {error}</Text>;
    }

    if (searchText.trim() !== '') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>
          {isSearching && <ActivityIndicator color={colors.primaryText} />}
          {!isSearching && searchResults.length === 0 && <Text style={styles.infoText}>Không tìm thấy ai.</Text>}
          {searchResults.map(user => {

            let actionButton;
            switch (user.status) {
              case 'is_friend':
                actionButton = (
                  <View style={[styles.actionButton, styles.friendButton]}>
                    <Text style={styles.friendButtonText}>Bạn bè</Text>
                  </View>
                );
                break;
              case 'pending':
                actionButton = (
                  <TouchableOpacity style={[styles.actionButton, styles.pendingButton]} disabled={true}>
                    <Text style={styles.actionButtonText}>Đã gửi</Text>
                  </TouchableOpacity>
                );
                break;
              default: // 'not_friend'
                actionButton = (
                  <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={() => handleSendRequest(user.id)}>
                    <Text style={styles.actionButtonText}>Kết bạn</Text>
                  </TouchableOpacity>
                );
                break;
            }

            return (
              <FriendItem key={user.id} {...user}>
                {actionButton}
              </FriendItem>
            );
          })}
        </View>
      );
    }

    return (
      <>
        {/* Phần lời mời kết bạn */}
        {friendRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lời mời kết bạn ({friendRequests.length})</Text>
            {friendRequests.map(req => (
              <FriendItem key={req.id} {...req} onRemove={() => handleAcceptRequest(req)}>
                <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={() => handleAcceptRequest(req)}>
                  <Text style={styles.actionButtonText}>Chấp nhận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.declineButton]} onPress={() => handleRejectRequest(req.id)} >
                  <Text style={styles.actionButtonText}>Từ chối</Text>
                </TouchableOpacity>
              </FriendItem>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tìm bạn bè từ các ứng dụng khác</Text>
          <View style={styles.appLinksContainer}>
            {MOCK_APP_LINKS_DATA.map(app => (
              <AppLink key={app.id} {...app} onPress={() => console.log(`Open ${app.appName}`)}/>
            ))}
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bạn bè của bạn</Text>
          {friends.map(friend => (
            <FriendItem
              key={friend.id}
              {...friend}
              onRemove={handleRemoveFriend}
            />
          ))}
        </View> */}
        {/* Phần bạn bè hiện tại */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bạn bè của bạn</Text>
          {friends.length === 0 && <Text style={styles.infoText}>Hãy tìm và thêm bạn bè mới!</Text>}
          {friends.map(friend => (
            <FriendItem key={friend.id} {...friend} onRemove={handleRemoveFriend} />
          ))}
        </View>
      </>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Animated.View
        style={[ styles.animatedContainer, { opacity: opacity, transform: [{ translateY: pan.y }] } ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.pullDownHandleContainer}>
          <View style={styles.pullDownHandle} />
        </View>

        <View style={styles.fixedContentWrapper}>
          <View style={styles.header}>
            <Text style={styles.title}>Bạn bè của bạn</Text>
            {/* --- BƯỚC 3.7: CẬP NHẬT SỐ LƯỢNG BẠN BÈ ĐỘNG --- */}
            <Text style={styles.subtitle}>{friends.length} / 20 người bạn đã được bổ sung</Text>
          </View>
          <SearchBarFriends value={searchText} onChangeText={handleSearch} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {renderContent()}
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
  },
  pullDownHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.tertiaryText,
  },
  fixedContentWrapper: {
    paddingHorizontal: spacing.large,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: spacing.large,
    paddingTop: spacing.small,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  infoText: { color: colors.secondaryText, textAlign: 'center', marginTop: 10 },
  actionButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginLeft: 10 },
  actionButtonText: { color: '#000', fontWeight: '600' },
  acceptButton: { backgroundColor: colors.primary },
  declineButton: { backgroundColor: colors.surface },
  pendingButton: { backgroundColor: colors.tertiaryText, opacity: 0.7 },
  friendButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.secondaryText,
  },
  friendButtonText: {
    color: colors.secondaryText,
    fontWeight: '600',
  },
});

export default FriendsScreen;