import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  FiBookmark,
  FiPlusCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiRefreshCw,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Bookings = ({ isDark }) => {
  const {
    bookings,
    fetchBookings,
    getBookingStats,
    updateBookingStatus,
    updatePaymentStatus,
    bulkUpdateBookingStatus,
    deleteBookingAdmin,
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    totalBookingValue: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1,
  });

  // Fetch bookings and stats
  const loadBookings = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const [bookingsData, statsData] = await Promise.all([
        fetchBookings(
          filters.page,
          filters.limit,
          filters.status,
          filters.paymentStatus
        ),
        getBookingStats(),
      ]);

      // Debug log to see the booking data structure
      console.log('Bookings data received:', bookingsData);
      if (bookingsData.bookings && bookingsData.bookings.length > 0) {
        console.log('First booking structure:', bookingsData.bookings[0]);
      }

      setPagination({
        total: bookingsData.total,
        totalPages: bookingsData.totalPages,
        currentPage: bookingsData.currentPage,
      });

      if (statsData.success) {
        setStats(statsData.stats);
      }

      if (showToast) {
        toast.success('Bookings refreshed successfully');
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle booking actions
  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const result = await updateBookingStatus(bookingId, status);
      if (result.success) {
        toast.success(`Booking status updated to ${status}`);
        loadBookings();
      } else {
        toast.error(result.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating booking status');
    }
  };

  const handlePaymentStatusUpdate = async (
    bookingId,
    paymentStatus,
    transactionId = ''
  ) => {
    try {
      const result = await updatePaymentStatus(
        bookingId,
        paymentStatus,
        transactionId
      );
      if (result.success) {
        toast.success(`Payment status updated to ${paymentStatus}`);
        loadBookings();
      } else {
        toast.error(result.message || 'Failed to update payment status');
      }
    } catch (error) {
      toast.error('Error updating payment status');
    }
  };

  const handleBulkStatusUpdate = async (bookingIds, status) => {
    try {
      const result = await bulkUpdateBookingStatus(bookingIds, status);
      if (result.success) {
        toast.success(`Updated ${result.modifiedCount} bookings to ${status}`);
        loadBookings();
      } else {
        toast.error(result.message || 'Failed to bulk update');
      }
    } catch (error) {
      toast.error('Error bulk updating bookings');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const result = await deleteBookingAdmin(bookingId);
      if (result.success) {
        toast.success('Booking deleted successfully');
        loadBookings();
      } else {
        toast.error(result.message || 'Failed to delete booking');
      }
    } catch (error) {
      toast.error('Error deleting booking');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>
          <p
            className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: FiBookmark,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
      borderColor: isDark ? 'border-blue-800' : 'border-blue-100',
      textColor: isDark ? 'text-blue-400' : 'text-blue-600',
    },
    {
      title: 'Confirmed',
      value: stats.confirmedBookings,
      icon: FiCalendar,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: isDark ? 'bg-green-900/20' : 'bg-green-50',
      borderColor: isDark ? 'border-green-800' : 'border-green-100',
      textColor: isDark ? 'text-green-400' : 'text-green-600',
    },
    {
      title: 'Pending',
      value: stats.pendingBookings,
      icon: FiClock,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: isDark ? 'bg-amber-900/20' : 'bg-amber-50',
      borderColor: isDark ? 'border-amber-800' : 'border-amber-100',
      textColor: isDark ? 'text-amber-400' : 'text-amber-600',
    },
    {
      title: 'Completed',
      value: stats.completedBookings,
      icon: FiCheckCircle,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: isDark ? 'bg-purple-900/20' : 'bg-purple-50',
      borderColor: isDark ? 'border-purple-800' : 'border-purple-100',
      textColor: isDark ? 'text-purple-400' : 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1
            className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Bookings Management
          </h1>
          <p
            className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            } mt-2`}
          >
            View and manage all property bookings with comprehensive insights
          </p>
        </div>

        {/* Decorative Element */}
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {/* Filters */}
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiFilter
                className={`h-4 w-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className={`px-3 py-1 text-sm rounded-lg border ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={filters.paymentStatus}
                onChange={(e) =>
                  handleFilterChange('paymentStatus', e.target.value)
                }
                className={`px-3 py-1 text-sm rounded-lg border ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">All Payments</option>
                <option value="pending">Payment Pending</option>
                <option value="completed">Payment Completed</option>
                <option value="failed">Payment Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <button
              onClick={() => loadBookings(true)}
              disabled={refreshing}
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              } ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiRefreshCw
                className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          {/* Add Booking Button */}
          <Link to="/add-booking">
            <button className="btn-primary flex items-center bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg">
              <FiPlusCircle className="mr-2 h-4 w-4" />
              Add New Booking
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
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

      {/* Bookings Table */}
      <div
        className={`${
          isDark ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-xl border ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } overflow-hidden`}
      >
        <div
          className={`px-6 py-4 border-b ${
            isDark
              ? 'border-gray-700 bg-gray-900/50'
              : 'border-gray-200 bg-gray-50/50'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2
                className={`text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                All Bookings
              </h2>
              <p
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                } mt-1`}
              >
                Manage property bookings, status, and details (
                {pagination.total} total)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <FiBookmark
                className={`mx-auto h-16 w-16 ${
                  isDark ? 'text-gray-600' : 'text-gray-400'
                } mb-4`}
              />
              <h3
                className={`text-lg font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-900'
                } mb-2`}
              >
                No bookings found
              </h3>
              <p
                className={`text-sm ${
                  isDark ? 'text-gray-500' : 'text-gray-600'
                }`}
              >
                No bookings match your current filters. Try adjusting your
                search criteria.
              </p>
            </div>
          ) : (
            <>
              {/* Simple Bookings Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr
                      className={`border-b ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <th
                        className={`text-left py-3 px-4 font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Guest
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Property
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Dates
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Status
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Payment
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Total
                      </th>
                      <th
                        className={`text-left py-3 px-4 font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className={`border-b ${
                          isDark
                            ? 'border-gray-700 hover:bg-gray-800'
                            : 'border-gray-200 hover:bg-gray-50'
                        } transition-colors`}
                      >
                        <td
                          className={`py-4 px-4 ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                          }`}
                        >
                          <div>
                            <div className="font-medium">
                              {booking.buyer?.name ||
                                booking.contactInfo?.name ||
                                'N/A'}
                            </div>
                            <div
                              className={`text-sm ${
                                isDark ? 'text-gray-500' : 'text-gray-600'
                              }`}
                            >
                              {booking.buyer?.email ||
                                booking.contactInfo?.email ||
                                'N/A'}
                            </div>
                          </div>
                        </td>
                        <td
                          className={`py-4 px-4 ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                          }`}
                        >
                          {booking.property?.title || 'Property Not Found'}
                        </td>
                        <td
                          className={`py-4 px-4 ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                          }`}
                        >
                          <div className="text-sm">
                            <div>
                              Check-in:{' '}
                              {booking.bookingDetails?.checkInDate
                                ? new Date(
                                    booking.bookingDetails.checkInDate
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </div>
                            <div>
                              Check-out:{' '}
                              {booking.bookingDetails?.checkOutDate
                                ? new Date(
                                    booking.bookingDetails.checkOutDate
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              handleStatusUpdate(booking._id, e.target.value)
                            }
                            className={`px-2 py-1 rounded text-sm border ${
                              isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={booking.payment?.status || 'pending'}
                            onChange={(e) =>
                              handlePaymentStatusUpdate(
                                booking._id,
                                e.target.value
                              )
                            }
                            className={`px-2 py-1 rounded text-sm border ${
                              isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                        <td
                          className={`py-4 px-4 font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                          }`}
                        >
                          NPR {booking.payment?.amount?.toLocaleString() || '0'}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded border border-red-500 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <div
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Showing page {pagination.currentPage} of{' '}
                    {pagination.totalPages} ({pagination.total} total bookings)
                  </div>
                  <div className="flex space-x-2">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded text-sm ${
                          page === pagination.currentPage
                            ? 'bg-blue-500 text-white'
                            : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
