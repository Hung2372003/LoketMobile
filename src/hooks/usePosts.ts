// hooks/usePosts.ts
import { useState, useEffect } from 'react';
import { postService, Post } from '../services/postService';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      const response = await postService.getPosts();

      if (!response.error) {
        setPosts(response.object);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error in usePosts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshPosts = () => {
    fetchPosts(true);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    refreshing,
    refreshPosts,
    refetch: fetchPosts
  };
};