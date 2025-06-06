import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, getBlogCategories, getBlogTags } from '../../api/cmsApi';
import { format } from 'date-fns';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        const [postsData, categoriesData, tagsData] = await Promise.all([
          getBlogPosts(),
          getBlogCategories(),
          getBlogTags()
        ]);
        
        setPosts(postsData.posts);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTag && matchesSearch;
  });

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-teal-500  text-white py-20">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">SajiloBasai Blog</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Expert advice, market trends, and tips for finding your perfect home in Nepal
          </p>
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search blog posts..."
              className="w-full px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute right-3 top-3 h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                    !selectedCategory
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Properties */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Featured Properties</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Link 
                    to="/properties/1" 
                    key={i} 
                    className="flex gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={`https://source.unsplash.com/random/200x200/?house,${i}`} 
                        alt="Property" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Apartment in Kathmandu</h4>
                      <p className="text-xs text-gray-500">Rs. 35,000/month</p>
                      <div className="flex items-center mt-1">
                        <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-600">4.5 (12 reviews)</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map(post => (
                  <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="h-64 bg-gray-200 overflow-hidden">
                      <img 
                        src={post.featuredImage || `https://source.unsplash.com/random/800x400/?nepal,${post.id}`} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
                        <span>•</span>
                        <span className="text-blue-600 font-medium">{post.category}</span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {post.tags.map(tag => (
                            <span 
                              key={tag}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                        >
                          Read More
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">No Posts Found</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any posts matching your criteria. Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedTag(null);
                    setSearchQuery('');
                  }}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;