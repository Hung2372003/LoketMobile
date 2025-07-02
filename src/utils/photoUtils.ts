// utils/photoUtils.ts
import { Post } from '../services/postService';

export interface PhotoItem {
  id: string;
  uri: string;
  type: string;
  postId: number;
  userName: string;
  userAvatar: string;
  createdTime: string;
  fileId: number;
}

export const convertPostsToPhotos = (posts: Post[]): PhotoItem[] => {
  const photos: PhotoItem[] = [];

  posts.forEach(post => {
    if (post.listFile && post.listFile.length > 0) {
      post.listFile.forEach(file => {
        // Only include image files
        if (file.type.startsWith('image/')) {
          photos.push({
            id: `${post.id}-${file.id}`,
            uri: file.path,
            type: file.type,
            postId: post.id,
            userName: post.name,
            userAvatar: post.avatar,
            createdTime: post.createdTime,
            fileId: file.id,
          });
        }
      });
    }
  });

  return photos.sort((a, b) =>
    new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
  );
};

export const getPhotoStats = (photos: PhotoItem[]) => {
  const totalPhotos = photos.length;
  const uniqueUsers = new Set(photos.map(photo => photo.userName)).size;
  const uniquePosts = new Set(photos.map(photo => photo.postId)).size;

  return {
    totalPhotos,
    uniqueUsers,
    uniquePosts,
  };
};