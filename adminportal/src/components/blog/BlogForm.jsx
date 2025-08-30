// src/components/blog/BlogForm.jsx
import { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogForm = ({ initialData, onSave, onCancel, isDark, isLoading }) => {
  const [post, setPost] = useState(
    initialData || {
      title: '',
      category: '',
      content: '',
      excerpt: '',
      tags: [],
      status: 'draft',
      featuredImage: null,
    }
  );
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setPost(initialData);
      setImagePreview(initialData.featuredImage || null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setPost((prev) => ({
        ...prev,
        [name]: value
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      }));
    } else {
      setPost((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleContentChange = (content) => {
    setPost((prev) => ({ ...prev, content }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setPost((prev) => ({ ...prev, featuredImage: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setPost((prev) => ({ ...prev, featuredImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!post.title) newErrors.title = 'Title is required';
    if (!post.content) newErrors.content = 'Content is required';
    if (!post.category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      await onSave(post);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
    'video',
  ];

  return (
    <div
      className={`rounded-xl shadow-xl border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } p-6`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={post.title || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter blog post title"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Category and Status Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={post.category || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } ${errors.category ? 'border-red-500' : ''}`}
              placeholder="Enter category"
              disabled={isLoading}
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Status
            </label>
            <select
              name="status"
              value={post.status || 'draft'}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              disabled={isLoading}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Excerpt Field */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={post.excerpt || ''}
            onChange={handleChange}
            rows="3"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Brief summary of the blog post"
            disabled={isLoading}
          />
        </div>

        {/* Tags Field */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={post.tags ? post.tags.join(', ') : ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Enter tags separated by commas"
            disabled={isLoading}
          />
        </div>

        {/* Featured Image Field */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Featured Image
          </label>
          <div className="flex items-start space-x-4">
            {imagePreview && (
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-lg border-2 border-gray-300 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4'
                    : 'bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4'
                }`}
                disabled={isLoading}
              />
              <p
                className={`mt-1 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Content Field */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Content *
          </label>
          <div
            className={`${
              errors.content ? 'border-red-500 border rounded-lg' : ''
            }`}
          >
            <ReactQuill
              theme="snow"
              value={post.content || ''}
              onChange={handleContentChange}
              modules={quillModules}
              formats={quillFormats}
              className={`${isDark ? 'quill-dark' : ''}`}
              style={{
                backgroundColor: isDark ? '#374151' : '#ffffff',
                color: isDark ? '#ffffff' : '#000000',
              }}
              readOnly={isLoading}
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-2 border rounded-lg font-medium transition-colors duration-200 ${
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            disabled={isLoading}
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {isLoading
              ? 'Saving...'
              : initialData?._id
              ? 'Update Post'
              : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;