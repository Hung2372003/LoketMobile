// utils/postUtils.ts
import { Post } from '../services/postService';

export interface FeedItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  image: string;
  timestamp: string;
  caption?: string;
}

export const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInMinutes < 1440) { // 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} giờ trước`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    if (days < 7) {
      return `${days} ngày trước`;
    } else {
      // Format as date for older posts
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }
};

export const convertPostsToFeedItems = (posts: Post[]): FeedItem[] => {
  return posts
    .filter(post => post.listFile && post.listFile.length > 0) // Chỉ lấy post có ảnh
    .map(post => ({
      id: post.id.toString(),
      user: {
        name: post.name,
        avatar: post.avatar,
      },
      image: post.listFile[0].path, // Lấy ảnh đầu tiên
      timestamp: formatTimestamp(post.createdTime),
      caption: post.content || undefined,
    }));
};