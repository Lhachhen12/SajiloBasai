import { useState, useEffect } from 'react';
import { getBookingsByBuyerId } from '../../api/bookingApi';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const BuyerBookings = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getBookingsByBuyerId(currentUser?.id || 1);
        setBookings(data);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [currentUser]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Booking History</h1>
        <p className="text-gray-600">View and manage your property bookings</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={booking.property.imageUrl}
                      alt={booking.property.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {booking.property.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Booking #{booking.id} • {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(booking.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Seller</span>
                    <p className="font-medium text-gray-800">{booking.seller.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount</span>
                    <p className="font-medium text-gray-800">
                      ${booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Commission</span>
                    <p className="font-medium text-gray-800">
                      ${booking.commission.toLocaleString()} (5%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <FaClock className="text-2xl text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Yet</h2>
          <p className="text-gray-600">
            You haven't made any property bookings yet. Start browsing properties to find your perfect match.
          </p>
        </div>
      )}
    </div>
  );
};

export default BuyerBookings;