
export interface Friend {
  id: number;
  name: string;
  avatar: string;
}

export interface AppLinkData {
  id: string;
  appName: string;
  iconColor?: string;
  isImage?: boolean;
  imageSource?: any;
};

export interface FriendRequest {
  id: string;      // ID của người gửi lời mời
  name: string;    // Tên của người gửi
  avatar: string;  // URL ảnh đại diện của người gửi
}

export interface SearchResult {
  id: string;      // ID của người dùng được tìm thấy
  name: string;    // Tên của người dùng
  avatar: string;  // URL ảnh đại diện
  /**
   * Trạng thái mối quan hệ với người dùng hiện tại:
   * - 'not_friend': Chưa phải là bạn bè.
   * - 'pending': Đã gửi lời mời và đang chờ phản hồi.
   * - 'is_friend': Đã là bạn bè.
   */
  status: 'not_friend' | 'pending' | 'is_friend';
}