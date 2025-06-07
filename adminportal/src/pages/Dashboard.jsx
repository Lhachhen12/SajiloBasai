import { useState } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import ChartPlaceholder from '../components/dashboard/ChartPlaceholder';
import RecentListings from '../components/dashboard/RecentListings';
import {
  FiUsers,
  FiHome,
  FiUserCheck,
  FiActivity,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = ({ isDark }) => {
  // Dummy data with Kathmandu locations
  const dashboardStats = {
    totalUsers: 1845,
    totalListings: 672,
    totalVisits: 9243,
    activeSellers: 328
  };

  // Weekly performance data
  const weeklyPerformanceData = [
    { name: 'Sun', users: 120 },
    { name: 'Mon', users: 210 },
    { name: 'Tue', users: 180 },
    { name: 'Wed', users: 250 },
    { name: 'Thu', users: 220 },
    { name: 'Fri', users: 300 },
    { name: 'Sat', users: 280 }
  ];

  const listingsByLocationData = [
    { name: 'Bhaktapur', value: 185 },
    { name: 'Lalitpur', value: 142 },
    { name: 'Boudha', value: 98 },
    { name: 'Chabahil', value: 76 },
    { name: 'Gokarna', value: 63 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

  const recentListings = [
    {
      id: 1,
      title: 'Traditional House in Bhaktapur',
      type: 'House',
      location: 'Bhaktapur Durbar Square',
      price: 1500,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200'
    },
    {
      id: 2,
      title: 'Modern Apartment in Lalitpur',
      type: 'Apartment',
      location: 'Patan, Lalitpur',
      price: 1200,
      status: 'Pending',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=200'
    },
    {
      id: 3,
      title: 'Studio near Boudhanath',
      type: 'Studio',
      location: 'Boudha',
      price: 800,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200'
    },
    {
      id: 4,
      title: 'Commercial Space in Chabahil',
      type: 'Commercial',
      location: 'Chabahil Chowk',
      price: 2500,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=200'
    }
  ];

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Users" 
          value={dashboardStats.totalUsers.toLocaleString()} 
          icon={<FiUsers className="h-5 w-5" />}
          percentage={12.5} 
          isIncrease={true}
          isDark={isDark}
        />
        <StatsCard 
          title="Total Listings" 
          value={dashboardStats.totalListings.toLocaleString()} 
          icon={<FiHome className="h-5 w-5" />}
          percentage={8.2} 
          isIncrease={true}
          isDark={isDark}
        />
        <StatsCard 
          title="Active Sellers" 
          value={dashboardStats.activeSellers.toLocaleString()} 
          icon={<FiUserCheck className="h-5 w-5" />}
          percentage={5.1} 
          isIncrease={true}
          isDark={isDark}
        />
        <StatsCard 
          title="Total Visits" 
          value={dashboardStats.totalVisits.toLocaleString()} 
          icon={<FiActivity className="h-5 w-5" />}
          percentage={15.3} 
          isIncrease={true}
          isDark={isDark}
        />
      </div>
      
      {/* Charts & Recent Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div className={`rounded-xl shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4">User Growth (This Week)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4B5563' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="name" 
                    stroke={isDark ? '#9CA3AF' : '#6B7280'} 
                  />
                  <YAxis 
                    stroke={isDark ? '#9CA3AF' : '#6B7280'} 
                  />
                  <Tooltip 
                    contentStyle={isDark ? { 
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      borderRadius: '0.5rem'
                    } : null}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className={`rounded-xl shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4">Listings by Location</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={listingsByLocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {listingsByLocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={isDark ? { 
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      borderRadius: '0.5rem'
                    } : null}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div>
          <RecentListings listings={recentListings} isDark={isDark} />
        </div>
      </div>
      
      {/* Weekly Performance */}
      <div className={`rounded-xl shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyPerformanceData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4B5563' : '#E5E7EB'} />
              <XAxis 
                dataKey="name" 
                stroke={isDark ? '#9CA3AF' : '#6B7280'} 
              />
              <YAxis 
                stroke={isDark ? '#9CA3AF' : '#6B7280'} 
              />
              <Tooltip 
                contentStyle={isDark ? { 
                  backgroundColor: '#1F2937',
                  borderColor: '#374151',
                  borderRadius: '0.5rem'
                } : null}
              />
              <Legend />
              <Bar dataKey="users" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;