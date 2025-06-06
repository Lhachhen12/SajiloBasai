import { useState, useEffect } from 'react';
import { getPageContent } from '../../api/cmsApi';
import ReactMarkdown from 'react-markdown';

const AboutPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getPageContent('about');
        setContent(data);
      } catch (error) {
        console.error('Error loading about page content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About SajiloBasai</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Your trusted partner for finding rooms, flats, and apartments across Nepal
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ) : content ? (
            <>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
  <div className="p-8 md:p-10">
    <article className="prose prose-lg max-w-none">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-8" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-gray-700 mb-5 mt-10 border-b pb-2 border-gray-100" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-medium text-gray-700 mb-4 mt-8" {...props} />,
          p: ({node, ...props}) => <p className="text-gray-600 mb-6 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="mb-6 pl-5 space-y-2" {...props} />,
          li: ({node, ...props}) => <li className="text-gray-600" {...props} />,
        }}
      >
        {content.content}
      </ReactMarkdown>
    </article>
  </div>
</div>
              
              {/* Team Section */}
              <div className="bg-gray-50 px-8 py-12 rounded-2xl mb-12">
                <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {content.team?.map((member, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        <img 
                          src={member.image || 'https://randomuser.me/api/portraits/men/'+(index+40)+'.jpg'} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 text-center">
                        <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-blue-600 mb-3">{member.position}</p>
                        <p className="text-gray-600">{member.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Mission Section */}
              <div className="p-8 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-2xl">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg">
                    To make finding rental properties in Nepal simple, transparent, and stress-free for everyone.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Not Found</h2>
              <p className="text-gray-600">
                The page content is currently unavailable. Please try again later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;