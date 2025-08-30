// src/components/blog/BlogTable.jsx
import { FiEye, FiEdit2, FiTrash2, FiFileText } from 'react-icons/fi';

const BlogTable = ({ posts, onEdit, onView, onDelete, isDark, isLoading }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <FiFileText
          className={`mx-auto h-12 w-12 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`}
        />
        <h3
          className={`mt-4 text-lg font-medium ${
            isDark ? 'text-gray-300' : 'text-gray-900'
          }`}
        >
          No blog posts found
        </h3>
        <p
          className={`mt-2 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Get started by creating your first blog post.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              Title
            </th>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              Category
            </th>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              Status
            </th>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              Published
            </th>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          className={`divide-y ${
            isDark ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
          }`}
        >
          {posts.map((post) => (
            <tr
              key={post._id}
              className={`${isLoading ? 'opacity-70' : ''} ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              } transition-colors duration-200`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div
                  className={`flex items-center ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  <FiFileText className="mr-2" />
                  <div className="text-sm font-medium">{post.title}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div
                  className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {post.category}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    post.status === 'published'
                      ? isDark
                        ? 'bg-green-900/50 text-green-300'
                        : 'bg-green-100 text-green-800'
                      : post.status === 'archived'
                      ? isDark
                        ? 'bg-gray-900/50 text-gray-300'
                        : 'bg-gray-100 text-gray-800'
                      : isDark
                      ? 'bg-yellow-900/50 text-yellow-300'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {post.status.charAt(0).toUpperCase() +
                    post.status.slice(1).toLowerCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div
                  className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onView(post)}
                    disabled={isLoading}
                    className={`${
                      isDark
                        ? 'text-blue-400 hover:text-blue-300'
                        : 'text-blue-600 hover:text-blue-900'
                    } transition-colors duration-200 disabled:opacity-50`}
                    title="View post"
                  >
                    <FiEye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(post)}
                    disabled={isLoading}
                    className={`${
                      isDark
                        ? 'text-indigo-400 hover:text-indigo-300'
                        : 'text-indigo-600 hover:text-indigo-900'
                    } transition-colors duration-200 disabled:opacity-50`}
                    title="Edit post"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(post._id)}
                    disabled={isLoading}
                    className={`${
                      isDark
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-red-600 hover:text-red-900'
                    } transition-colors duration-200 disabled:opacity-50`}
                    title="Delete post"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogTable;