// src/utils/blogApi.js
import { adminApi } from './adminApi';

// Get all blog posts
export const getBlogPosts = async () => {
  try {
    const response = await adminApi.getBlogPosts();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

// Get blog post by ID
export const getBlogPostById = async (id) => {
  try {
    const response = await adminApi.getBlogPost(id);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

// Create blog post
export const createBlogPost = async (postData) => {
  try {
    const response = await adminApi.createBlogPost(postData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { success: false, message: error.message };
  }
};

// Update blog post
export const updateBlogPost = async (id, postData) => {
  try {
    const response = await adminApi.updateBlogPost(id, postData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return { success: false, message: error.message };
  }
};

// Delete blog post
export const deleteBlogPost = async (id) => {
  try {
    await adminApi.deleteBlogPost(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return { success: false, message: error.message };
  }
};