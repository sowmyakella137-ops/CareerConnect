import api from './api.js';

/**
 * Isolated Post, Like, and Comment service.
 * Connects to Spring Boot's PostController and PostInteractionController.
 */
export const postService = {
  /**
   * Fetch all feed posts
   */
  async getPosts() {
    const response = await api.get('/api/posts');
    return response.data;
  },

  /**
   * Create a new feed post
   * @param {Object} postData - { content: string, title?: string }
   */
  async createPost(postData) {
    const response = await api.post('/api/posts', postData);
    return response.data;
  },

  /**
   * Like a post
   * @param {string|number} postId
   */
  async likePost(postId) {
    const response = await api.post(`/api/posts/${postId}/likes`);
    return response.data;
  },

  /**
   * Unlike a post
   * @param {string|number} postId
   */
  async unlikePost(postId) {
    
      const response = await api.delete(`/api/posts/${postId}/likes`);
      return response.data;
    
  },

  /**
   * Get comments for a post
   * @param {string|number} postId
   */
  async getComments(postId) {
    const response = await api.get(`/api/posts/${postId}/comments`);
    return response.data;
  },

  /**
   * Add a comment to a post
   * @param {string|number} postId
   * @param {Object|string} commentData - { content: string } or text string
   */
  async addComment(postId, commentData) {
    const payload = typeof commentData === 'string' ? { content: commentData } : commentData;
    const response = await api.post(`/api/posts/${postId}/comments`, payload);
    return response.data;
  },
};

export default postService;
