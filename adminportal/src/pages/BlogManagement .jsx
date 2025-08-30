// src/pages/BlogManagement.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import BlogStats from '../components/blog/BlogStats';
import BlogForm from '../components/blog/BlogForm';
import BlogTable from '../components/blog/BlogTable';
import { getBlogPosts, deleteBlogPost, createBlogPost, updateBlogPost } from '../utils/blogApi';

const BlogManagement = ({ isDark }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (postData) => {
    try {
      setIsSaving(true);
      let result;
      
      if (editingPost) {
        result = await updateBlogPost(editingPost._id, postData);
      } else {
        result = await createBlogPost(postData);
      }

      if (result.success) {
        await loadBlogPosts(); // Reload the posts
        setShowForm(false);
        setEditingPost(null);
      } else {
        alert(result.message || 'Error saving blog post');
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Error saving blog post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        setIsDeleting(true);
        const result = await deleteBlogPost(postId);
        
        if (result.success) {
          await loadBlogPosts(); // Reload the posts
        } else {
          alert(result.message || 'Error deleting blog post');
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Error deleting blog post');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleView = (post) => {
    setViewingPost(post);
    // You could implement a view modal here
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  if (showForm) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex flex-col space-y-4">
          <h1
            className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
        </div>
        <BlogForm
          initialData={editingPost}
          onSave={handleSave}
          onCancel={handleCancel}
          isDark={isDark}
          isLoading={isSaving}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1
            className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Blog Management
          </h1>
          <p
            className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            } mt-2`}
          >
            Create and manage blog posts for your website
          </p>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add New Post
          </button>
        </div>
      </div>

      <BlogStats
        posts={posts}
        isDark={isDark}
      />

      <div
        className={`rounded-xl shadow-xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } overflow-hidden`}
      >
        <div
          className={`px-6 py-4 border-b ${
            isDark
              ? 'border-gray-700 bg-gray-900/50'
              : 'border-gray-200 bg-gray-50/50'
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            All Blog Posts
          </h2>
          <p
            className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            } mt-1`}
          >
            Manage blog posts, content, and status
          </p>
        </div>
        <BlogTable
          posts={posts}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          isDark={isDark}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default BlogManagement;