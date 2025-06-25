import { Photo, Friend } from '../types/camera';
import { postService } from './postService';

class CameraService {
  private mockFriends: Friend[] = [
    {
      id: '1',
      name: 'Friend 1',
      avatar: 'https://via.placeholder.com/40',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Friend 2',
      avatar: 'https://via.placeholder.com/40',
      isOnline: false,
    },
    {
      id: '3',
      name: 'Friend 3',
      avatar: 'https://via.placeholder.com/40',
      isOnline: true,
    },
    {
      id: '4',
      name: 'Friend 4',
      avatar: 'https://via.placeholder.com/40',
      isOnline: true,
    },
  ];

  // API methods - sẵn sàng để implement
  async getFriends(): Promise<Friend[]> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.mockFriends), 500);
    });
  }

  async uploadPhoto(photo: Photo): Promise<boolean> {
    // TODO: Replace with actual API call
    console.log('Uploading photo:', photo);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 2000);
    });
  }

  async getNotificationCount(): Promise<number> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(3), 300);
    });
  }

  async sendPhotoToFriends(photo: Photo, friendIds: string[]): Promise<boolean> {
    // TODO: Replace with actual API call
    console.log('Sending photo to friends:', { photo, friendIds });
    return new Promise((resolve) => {
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