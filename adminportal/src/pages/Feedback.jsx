import { useState, useEffect } from 'react';
import { getFeedback, updateFeedback, deleteFeedback, getFeedbackStats } from '../utils/adminApi';
import {
  FiThumbsUp,
  FiThumbsDown,
  FiStar,
  FiCheck,
  FiTrash2,
  FiRefreshCw,
  FiFilter,
  FiUser,
  FiMail,
  FiEye,
  FiMessageSquare,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [filter]);

  const fetchData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true);
      else setLoading(true);

      const params = {};
      if (filter !== 'all') {
        // Map frontend filter values to backend values
        const filterMap = {
          'approved': { status: 'resolved' },
          'pending': { status: 'pending' },
          'rejected': { status: 'dismissed' },
          'featured': { featured: true },
          'frontend': { showOnFrontend: true }
        };
        
        if (filterMap[filter]) {
          Object.assign(params, filterMap[filter]);
        }
      }

      const response = await getFeedback(params);
      const feedbackData = response.data || [];
      
      // Transform the data to match frontend expectations
      const transformedFeedback = feedbackData.map((item) => ({
        id: item._id,
        user: item.user?.name || item.name || 'Anonymous User',
        email: item.user?.email || item.email || 'No email provided',
        rating: item.rating || 5,
        comment: item.message || item.comment || '',
        date: new Date(item.createdAt).toLocaleDateString(),
        category: item.category || 'general',
        type: item.type || 'general',
        // Map backend status to frontend status
        status: item.status === 'resolved' 
          ? 'Approved' 
          : item.status === 'pending' 
          ? 'Pending' 
          : item.status === 'dismissed' 
          ? 'Rejected' 
          : 'Pending',
        featured: item.featured || false,
        showOnFrontend: item.showOnFrontend || false,
        adminNotes: item.adminNotes || '',
        resolvedBy: item.resolvedBy?.name || null,
        resolvedAt: item.resolvedAt ? new Date(item.resolvedAt).toLocaleDateString() : null
      }));
      
      setFeedback(transformedFeedback);
      setPagination(response.pagination || { current: 1, pages: 1, total: transformedFeedback.length });
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      toast.error('Failed to load feedback data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getFeedbackStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Map frontend status to backend status values
      const statusMap = {
        'Approved': 'resolved',
        'Pending': 'pending', 
        'Rejected': 'dismissed'
      };

      const backendStatus = statusMap[newStatus];
      
      await updateFeedback(id, { status: backendStatus });
      
      setFeedback(prev =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      const statusMessage = newStatus === 'Approved' ? 'approved' : 'rejected';
      toast.success(`Feedback ${statusMessage} successfully!`);
      
      fetchStats();
    } catch (error) {
      console.error('Error updating feedback status:', error);
      toast.error('Failed to update feedback status');
    }
  };

  const handleFeatureToggle = async (id) => {
    try {
      const feedbackItem = feedback.find((item) => item.id === id);
      const newFeaturedStatus = !feedbackItem.featured;
      
      await updateFeedback(id, { featured: newFeaturedStatus });
      
      setFeedback(prev =>
        prev.map((item) =>
          item.id === id ? { ...item, featured: newFeaturedStatus } : item
        )
      );

      const message = newFeaturedStatus ? 'Featured feedback!' : 'Removed from featured';
      toast.success(message);
      
      fetchStats();
    } catch (error) {
      console.error('Error updating feedback feature status:', error);
      toast.error('Failed to update featured status');
    }
  };

  const handleFrontendDisplay = async (id) => {
    try {
      const feedbackItem = feedback.find((item) => item.id === id);
      const newFrontendStatus = !feedbackItem.showOnFrontend;
      
      await updateFeedback(id, {
        showOnFrontend: newFrontendStatus,
      });
      
      setFeedback(prev =>
        prev.map((item) =>
          item.id === id
            ? { ...item, showOnFrontend: newFrontendStatus }
            : item
        )
      );

      const message = newFrontendStatus ? 'Now showing on frontend!' : 'Removed from frontend';
      toast.success(message);
      
      fetchStats();
    } catch (error) {
      console.error('Error updating feedback frontend display:', error);
      toast.error('Failed to update frontend display');
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this feedback? This action cannot be undone.'
      )
    ) {
      try {
        await deleteFeedback(id);
        setFeedback(prev => prev.filter((item) => item.id !== id));
        toast.success('Feedback deleted successfully!');
        fetchStats();
      } catch (error) {
        console.error('Error deleting feedback:', error);
        toast.error('Failed to delete feedback');
      }
    }
  };

  const handleRefresh = () => {
    fetchData(true);
    fetchStats();
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      testimonial: 'bg-green-100 text-green-800',
      bug_report: 'bg-red-100 text-red-800',
      feature_request: 'bg-blue-100 text-blue-800'
    };
    return colors[category] || colors.general;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      general: 'General',
      testimonial: 'Testimonial',
      bug_report: 'Bug Report',
      feature_request: 'Feature Request'
    };
    return labels[category] || 'General';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  const filteredFeedback = feedback.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'featured') return item.featured;
    if (filter === 'frontend') return item.showOnFrontend;
    
    // Map filter to status values
    const statusMap = {
      'approved': 'Approved',
      'pending': 'Pending',
      'rejected': 'Rejected'
    };
    
    if (statusMap[filter]) {
      return item.status === statusMap[filter];
    }
    
    return item.status.toLowerCase() === filter;
  });

  const currentStats = {
    total: feedback.length,
    approved: feedback.filter(f => f.status === 'Approved').length,
    pending: feedback.filter(f => f.status === 'Pending').length,
    rejected: feedback.filter(f => f.status === 'Rejected').length,
    featured: feedback.filter(f => f.featured).length,
    frontend: feedback.filter(f => f.showOnFrontend).length
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Feedback Management
          </h1>
          <p className="text-sm text-gray-500">
            Review and manage customer feedback
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {currentStats.total}
          </div>
          <div className="text-sm text-gray-500">Total Feedback</div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {currentStats.approved}
          </div>
          <div className="text-sm text-gray-500">Approved</div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {currentStats.pending}
          </div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {currentStats.rejected}
          </div>
          <div className="text-sm text-gray-500">Rejected</div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {currentStats.featured}
          </div>
          <div className="text-sm text-gray-500">Featured</div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {currentStats.frontend}
          </div>
          <div className="text-sm text-gray-500">On Frontend</div>
        </div>
      </div>

      {/* Filter and Content */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FiFilter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-select border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Feedback ({currentStats.total})</option>
              <option value="pending">Pending ({currentStats.pending})</option>
              <option value="approved">Approved ({currentStats.approved})</option>
              <option value="rejected">Rejected ({currentStats.rejected})</option>
              <option value="featured">Featured ({currentStats.featured})</option>
              <option value="frontend">On Frontend ({currentStats.frontend})</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredFeedback.length} of {feedback.length} items
          </div>
        </div>

        {/* Feedback List */}
        {filteredFeedback.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <FiMessageSquare className="h-12 w-12 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No feedback found
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No feedback has been submitted yet.' 
                : `No feedback matches the "${filter}" filter.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFeedback.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center space-x-2">
                        <FiUser className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{item.user}</span>
                      </div>
                      <span className="mx-2 text-gray-300">•</span>
                      <div className="flex items-center space-x-1">
                        <FiMail className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-500">{item.email}</span>
                      </div>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    
                    {/* Rating and Category */}
                    <div className="flex items-center mb-3 space-x-4">
                      <div className="flex items-center">
                        {[...Array(item.rating)].map((_, i) => (
                          <FiStar
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">
                          ({item.rating}/5)
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    
                    {/* Comment */}
                    <p className="text-gray-700 mb-4 leading-relaxed">{item.comment}</p>
                    
                    {/* Status and Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                      {item.showOnFrontend && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          On Frontend
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="ml-4 flex items-center space-x-2">
                    {item.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(item.id, 'Approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Approve feedback"
                        >
                          <FiThumbsUp className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'Rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Reject feedback"
                        >
                          <FiThumbsDown className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleFeatureToggle(item.id)}
                          className={`p-2 rounded-full transition-colors ${
                            item.featured
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={
                            item.featured
                              ? 'Remove from featured'
                              : 'Add to featured'
                          }
                        >
                          <FiStar
                            className={`h-5 w-5 ${
                              item.featured ? 'fill-current' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleFrontendDisplay(item.id)}
                          className={`p-2 rounded-full transition-colors ${
                            item.showOnFrontend
                              ? 'text-purple-600 hover:bg-purple-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={
                            item.showOnFrontend
                              ? 'Remove from frontend'
                              : 'Show on frontend'
                          }
                        >
                          <FiCheck
                            className={`h-5 w-5 ${
                              item.showOnFrontend ? 'fill-current' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete feedback"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;