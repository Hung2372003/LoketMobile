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

export interface CreatePostData {
  content?: string;
  status?: string;
  file?: any; // Photo file
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
  },

  async createPost(data: CreatePostData): Promise<any> {
    try {
      const formData = new FormData();

      // Add status (default to PUBLIC)
      formData.append('status', data.status || 'PUBLIC');

      // Add content if provided
      if (data.content) {
        formData.append('content', data.content);
      }

      // Add file if provided
      if (data.file) {
        // Ensure proper file URI format
        let fileUri = data.file.uri || data.file.path;
        if (!fileUri.startsWith('file://')) {
          fileUri = `file://${fileUri}`;
        }

        // Get file extension from URI
        const uriParts = fileUri.split('.');
        const fileExtension = uriParts[uriParts.length - 1].toLowerCase();

        // Determine MIME type
        let mimeType = 'image/jpeg';
        if (fileExtension === 'png') {
          mimeType = 'image/png';
        } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
          mimeType = 'image/jpeg';
        }

        // Create file object for React Native
        const fileObject = {
          uri: fileUri,
          type: mimeType,
          name: `photo_${Date.now()}.${fileExtension === 'jpg' ? 'jpg' : fileExtension}`,
        };

        console.log('File object for upload:', fileObject);
        formData.append('Files', fileObject as any);
      }

      console.log('FormData contents:');
      // Note: You can't directly log FormData contents, but we can log what we're adding
      console.log('- status:', data.status || 'PUBLIC');
      console.log('- content:', data.content || 'none');
      console.log('- file:', data.file ? 'included' : 'none');

      const response = await axiosInstance.post('/api/PostManagement/AddNewPost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });

      console.log('Post creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);

      // // More detailed error logging
      // if (error.response) {
      //   console.error('Response error:', error.response.status, error.response.data);
      // } else if (error.request) {
      //   console.error('Request error:', error.request);
      // } else {
      //   console.error('Setup error:', error.message);
      // }

      throw error;
    }
  }
};