// src/components/blog/BlogStats.jsx
import { FiFileText, FiGlobe, FiBook, FiTrendingUp } from 'react-icons/fi';

const BlogStats = ({ posts, isDark }) => {
  const stats = [
    {
      title: 'Total Posts',
      value: posts.length,
      icon: FiFileText,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Published',
      value: posts.filter((post) => post.status === 'published').length,
      icon: FiGlobe,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Drafts',
      value: posts.filter((post) => post.status === 'draft').length,
      icon: FiBook,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Categories',
      value: new Set(posts.map((post) => post.category)).size,
      icon: FiTrendingUp,
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className={`${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            } border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-2`}
                >
                  {stat.title}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
              >
                <IconComponent className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogStats;