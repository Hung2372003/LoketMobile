import axiosInstance from '../api/axiosInstance.ts';

export interface PostFile {
  id: number;
  path: string;
  type: string;
}

export interface Post {
  id: number;
  content: string | null;
  createdBy: number;
  createdTime: string;
  status: string;
  likeNumber: number;
  commentNumber: number;
  like: boolean;
  avatar: string;
  name: string;
  listFile: PostFile[];
}

export interface PostResponse {
  title: string;
  error: boolean;
  object: Post[];
  id: null;
  preventiveObject: null;
}

export const postService = {
  async getPosts(): Promise<PostResponse> {
    try {
      const response = await axiosInstance.get<PostResponse>('/api/PostManagement/GetPost');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }
};