import {Friend, Photo} from '../types/camera';
import {postService} from './postService';
import friendService from './friendService.ts';

class CameraService {
  async getFriends(): Promise<Friend[]> {
    try {
      const data = await friendService.getFriends();
      return data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bạn bè:', error);
      return [];
    }
  }

  async uploadPhoto(photo: Photo): Promise<boolean> {
    // TODO: Replace with actual API call
    console.log('Uploading photo:', photo);
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 2000);
    });
  }

  async getNotificationCount(): Promise<number> {
    // TODO: Replace with actual API call
    return new Promise(resolve => {
      setTimeout(() => resolve(3), 300);
    });
  }

  async sendPhotoToFriends(
    photo: Photo,
    friendIds: string[],
  ): Promise<boolean> {
    // TODO: Replace with actual API call
    console.log('Sending photo to friends:', {photo, friendIds});
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 1500);
    });
  }

  // New method to create post using the real API
  async createPostWithPhoto(photo: Photo, content?: string): Promise<boolean> {
    try {
      const postData = {
        content: content,
        status: 'PUBLIC',
        file: photo,
      };

      await postService.createPost(postData);
      return true;
    } catch (error) {
      console.error('Error creating post with photo:', error);
      throw error;
    }
  }
}

export default new CameraService();