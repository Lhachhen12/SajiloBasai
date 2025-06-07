import { useState, useEffect } from 'react';
import UserTable from '../components/users/UserTable';
import { getUserList } from '../utils/adminApi';
import { FiUsers, FiUserCheck, FiTrendingUp, FiActivity } from 'react-icons/fi';

const Users = ({ isDark }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserList();
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  const activeUsers = users.filter(user => user.status === 'active').length;
  const newUsersThisMonth = users.filter(user => {
    const joinDate = new Date(user.joinDate);
    const now = new Date();
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: FiUsers,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
      borderColor: isDark ? 'border-blue-800' : 'border-blue-100',
      textColor: isDark ? 'text-blue-400' : 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: FiUserCheck,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: isDark ? 'bg-green-900/20' : 'bg-green-50',
      borderColor: isDark ? 'border-green-800' : 'border-green-100',
      textColor: isDark ? 'text-green-400' : 'text-green-600'
    },
    {
      title: 'New This Month',
      value: newUsersThisMonth,
      icon: FiTrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: isDark ? 'bg-purple-900/20' : 'bg-purple-50',
      borderColor: isDark ? 'border-purple-800' : 'border-purple-100',
      textColor: isDark ? 'text-purple-400' : 'text-purple-600'
    },
    {
      title: 'Growth Rate',
      value: '12.5%',
      icon: FiActivity,
      gradient: 'from-orange-500 to-red-500',
      bgColor: isDark ? 'bg-orange-900/20' : 'bg-orange-50',
      borderColor: isDark ? 'border-orange-800' : 'border-orange-100',
      textColor: isDark ? 'text-orange-400' : 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Users Management
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            Monitor and manage all platform users with comprehensive insights
          </p>
        </div>
        
        {/* Decorative Element */}
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.textColor} mb-2`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Users Table */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            All Users
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Manage user accounts, roles, and permissions
          </p>
        </div>
        
        <div className="p-6">
          <UserTable users={users} isDark={isDark} />
        </div>
      </div>
    </div>
  );
};

export default Users;