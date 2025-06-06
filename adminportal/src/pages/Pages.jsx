import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Pages = () => {
  const [pages, setPages] = useState([
    {
      id: 1,
      title: 'About Us',
      type: 'about',
      content: 'Welcome to RoomFinder...',
      lastUpdated: '2024-02-20',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Terms & Conditions',
      type: 'terms',
      content: 'By using our service...',
      lastUpdated: '2024-02-19',
      status: 'Published'
    },
    {
      id: 3,
      title: 'Privacy Policy',
      type: 'privacy',
      content: 'Your privacy matters...',
      lastUpdated: '2024-02-18',
      status: 'Draft'
    }
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [currentPage, setCurrentPage] = useState({
    title: '',
    type: 'about',
    content: '',
    status: 'Draft'
  });

  const handleSave = () => {
    if (currentPage.id) {
      setPages(pages.map(page => 
        page.id === currentPage.id ? {...currentPage, lastUpdated: new Date().toISOString().split('T')[0]} : page
      ));
    } else {
      setPages([...pages, {
        ...currentPage,
        id: Date.now(),
        lastUpdated: new Date().toISOString().split('T')[0]
      }]);
    }
    setShowEditor(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Page Management</h1>
          <p className="text-sm text-gray-500">Manage website content and pages</p>
        </div>
        <button
          onClick={() => {
            setCurrentPage({
              title: '',
              type: 'about',
              content: '',
              status: 'Draft'
            });
            setShowEditor(true);
          }}
          className="btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Add New Page
        </button>
      </div>

      {showEditor ? (
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Title
            </label>
            <input
              type="text"
              value={currentPage.title}
              onChange={(e) => setCurrentPage({...currentPage, title: e.target.value})}
              className="form-input w-full"
              placeholder="Enter page title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Type
            </label>
            <select
              value={currentPage.type}
              onChange={(e) => setCurrentPage({...currentPage, type: e.target.value})}
              className="form-select w-full"
            >
              <option value="about">About Us</option>
              <option value="terms">Terms & Conditions</option>
              <option value="privacy">Privacy Policy</option>
              <option value="blog">Blog Post</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <ReactQuill
              value={currentPage.content}
              onChange={(content) => setCurrentPage({...currentPage, content})}
              className="h-64 mb-12"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={currentPage.status}
              onChange={(e) => setCurrentPage({...currentPage, status: e.target.value})}
              className="form-select w-full"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowEditor(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary"
            >
              Save Page
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{page.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 capitalize">{page.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{page.lastUpdated}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      page.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => {
                          setCurrentPage(page);
                          setShowEditor(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Pages;