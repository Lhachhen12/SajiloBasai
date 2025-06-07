import { useState, useEffect } from 'react';
import BookingTable from '../components/bookings/BookingTable';
import { mockApi } from '../utils/adminApi';
import { FiBookmark, FiPlusCircle, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Bookings = ({ isDark }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await mockApi.getBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
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
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  const activeBookings = bookings.filter(booking => new Date(booking.checkInDate) <= new Date()).length;
  const upcomingBookings = bookings.filter(booking => new Date(booking.checkInDate) > new Date()).length;
  const completedBookings = bookings.filter(booking => booking.status === 'completed').length;

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: FiBookmark,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
      borderColor: isDark ? 'border-blue-800' : 'border-blue-100',
      textColor: isDark ? 'text-blue-400' : 'text-blue-600'
    },
    {
      title: 'Active Bookings',
      value: activeBookings,
      icon: FiCalendar,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: isDark ? 'bg-green-900/20' : 'bg-green-50',
      borderColor: isDark ? 'border-green-800' : 'border-green-100',
      textColor: isDark ? 'text-green-400' : 'text-green-600'
    },
    {
      title: 'Upcoming',
      value: upcomingBookings,
      icon: FiClock,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: isDark ? 'bg-amber-900/20' : 'bg-amber-50',
      borderColor: isDark ? 'border-amber-800' : 'border-amber-100',
      textColor: isDark ? 'text-amber-400' : 'text-amber-600'
    },
    {
      title: 'Completed',
      value: completedBookings,
      icon: FiCheckCircle,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: isDark ? 'bg-purple-900/20' : 'bg-purple-50',
      borderColor: isDark ? 'border-purple-800' : 'border-purple-100',
      textColor: isDark ? 'text-purple-400' : 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Bookings Management
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            View and manage all property bookings with comprehensive insights
          </p>
        </div>
        
        {/* Decorative Element */}
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
        
        {/* Add Booking Button */}
        <div className="flex justify-end">
          <Link to="/add-booking">
            <button className="btn-primary flex items-center bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white">
              <FiPlusCircle className="mr-2 h-4 w-4" />
              Add New Booking
            </button>
          </Link>
        </div>
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
      
      {/* Bookings Table */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'}`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            All Bookings
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Manage property bookings, status, and details
          </p>
        </div>
        
        <div className="p-6">
          <BookingTable bookings={bookings} isDark={isDark} />
        </div>
      </div>
    </div>
  );
};

export default Bookings;