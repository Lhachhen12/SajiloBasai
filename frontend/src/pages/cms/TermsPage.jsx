import { useState, useEffect } from 'react';
import { getPageContent } from '../../api/cmsApi';
import ReactMarkdown from 'react-markdown';

const TermsPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getPageContent('terms');
        setContent(data);
      } catch (error) {
        console.error('Error loading terms & conditions content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50">
      <div className="container-custom">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ) : content ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <article className="prose prose-primary max-w-none">
              <ReactMarkdown>{content.content}</ReactMarkdown>
            </article>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Not Found</h2>
            <p className="text-gray-600">
              The terms & conditions content is currently unavailable. Please try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsPage;