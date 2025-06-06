import { useState, useEffect } from 'react';
import { FaHeart, FaEnvelope, FaEye, FaChartBar } from 'react-icons/fa';
import { getBuyerDashboardStats } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/StatCard';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BuyerDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // In a real app, we would pass the current user ID
        const data = await getBuyerDashboardStats(currentUser?.id || 1);
        setStats(data);
      } catch (error) {
        console.error('Error loading buyer stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [currentUser]);

  // Chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Property Views',
        data: stats?.viewsChartData || [0, 0, 0, 0, 0, 0, 0],
        fill: false,
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Property Views',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {currentUser?.name || 'User'}</h1>
        <p className="text-gray-600">Here's what's happening with your property search</p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-5 rounded-lg shadow-sm animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Saved Properties" 
            value={stats?.wishlistCount || 0} 
            icon={<FaHeart className="text-xl" />} 
            color="blue"
          />
          
          <StatCard 
            title="Inquiries Sent" 
            value={stats?.inquiriesCount || 0} 
            icon={<FaEnvelope className="text-xl" />} 
            color="green"
          />
          
          <StatCard 
            title="Total Property Views" 
            value={stats?.viewsChartData?.reduce((a, b) => a + b, 0) || 0} 
            icon={<FaEye className="text-xl" />} 
            color="purple"
            change={12}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Properties Viewed</h2>
            <div className="flex items-center text-sm text-gray-500">
              <span>Last 7 days</span>
            </div>
          </div>
          
          {loading ? (
            <div className="h-64 bg-gray-100 rounded animate-pulse flex items-center justify-center">
              <FaChartBar className="text-4xl text-gray-300" />
            </div>
          ) : (
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
        
        {/* Property Types Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Property Types Visited</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex justify-between items-center mb-1">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-4 bg-gray-300 rounded w-12"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300 rounded-full" style={{ width: `${20 * i}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stats?.propertyTypesData && Object.entries(stats.propertyTypesData).map(([type, percentage]) => (
                <div key={type}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                    <span className="text-sm text-gray-600">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        type === 'apartment' ? 'bg-blue-500' :
                        type === 'house' ? 'bg-green-500' :
                        type === 'room' ? 'bg-purple-500' :
                        'bg-yellow-500'
                      }`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;