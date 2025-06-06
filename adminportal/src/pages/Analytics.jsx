import { useState } from 'react';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts';
import { FiActivity, FiUsers, FiBarChart2, FiCalendar } from 'react-icons/fi';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Dummy analytics data
  const analyticsData = {
    dailyVisits: [450, 680, 520, 750, 630, 820, 950],
    weeklyLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    topCities: [
      { city: 'New York', visits: 4500 },
      { city: 'Los Angeles', visits: 3200 },
      { city: 'Chicago', visits: 2800 },
      { city: 'Houston', visits: 2300 },
      { city: 'Phoenix', visits: 2100 }
    ],
    deviceStats: {
      mobile: 45,
      desktop: 40,
      tablet: 15
    },
    topProperties: [
      { title: 'Luxury Downtown Apartment', views: 1850 },
      { title: 'Modern Studio Near Campus', views: 1560 },
      { title: 'Cozy 2BR in Suburbs', views: 1340 },
      { title: 'Penthouse with City View', views: 1220 },
      { title: 'Shared Student Housing', views: 980 }
    ]
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">View site performance and visitor insights</p>
        </div>
        
        <div className="mt-4 sm:mt-0 inline-flex bg-white rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              timeRange === 'week'
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'month'
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              timeRange === 'year'
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dashboard-card bg-blue-50 border border-blue-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Visitors</p>
              <p className="text-xl font-bold">15,672</p>
              <p className="text-xs text-blue-500">+12.5% from last week</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card bg-green-50 border border-green-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FiActivity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Page Views</p>
              <p className="text-xl font-bold">42,893</p>
              <p className="text-xs text-green-500">+8.2% from last week</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card bg-purple-50 border border-purple-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <FiBarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">Conversion Rate</p>
              <p className="text-xl font-bold">3.2%</p>
              <p className="text-xs text-purple-500">+0.8% from last week</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card bg-amber-50 border border-amber-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 mr-4">
              <FiCalendar className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600">Avg. Session Time</p>
              <p className="text-xl font-bold">4m 32s</p>
              <p className="text-xs text-amber-500">+12s from last week</p>
            </div>
          </div>
        </div>
      </div>
      
      <AnalyticsCharts analyticsData={analyticsData} />
    </div>
  );
};

export default Analytics;