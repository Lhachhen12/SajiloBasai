import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost } from '../../api/cmsApi';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { FaCalendar, FaFolder, FaTags, FaArrowLeft } from 'react-icons/fa';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getBlogPost(slug);
        setPost(data);
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50">
      <div className="container-custom">
        <Link
          to="/blog"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Blog</span>
        </Link>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        ) : post ? (
          <article className="bg-white rounded-lg shadow-sm p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaCalendar className="mr-2 text-primary-500" />
                  <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
                </div>
                
                <div className="flex items-center">
                  <FaFolder className="mr-2 text-primary-500" />
                  <span>{post.category}</span>
                </div>
                
                <div className="flex items-center">
                  <FaTags className="mr-2 text-primary-500" />
                  <div className="flex gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            <div className="prose prose-primary max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <footer className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`}
                  alt={post.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium text-gray-800">{post.author}</p>
                  <p className="text-sm text-gray-600">Real Estate Expert</p>
                </div>
              </div>
            </footer>
          </article>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
            <p className="text-gray-600 mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog" className="btn-primary">
              Return to Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;