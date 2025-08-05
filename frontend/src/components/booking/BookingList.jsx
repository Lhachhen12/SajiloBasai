import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getMyBookings,
  updateBookingStatus,
  processPayment,
  addBookingNote,
} from '../../api/bookingApi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  FiCalendar,
  FiUser,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiMessageSquare,
  FiCheck,
  FiX,
  FiRefreshCw,
} from 'react-icons/fi';

const BookingList = ({ userRole = 'buyer' }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  // Fetch bookings
  const fetchBookings = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);

      const data = await getMyBookings();
      setBookings(data);

      if (showToast) {
        toast.success('Bookings refreshed successfully');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Handle booking status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    setActionLoading((prev) => ({ ...prev, [bookingId]: true }));

    try {
      const result = await updateBookingStatus(bookingId, newStatus);

      if (result.success) {
        toast.success(`Booking ${newStatus} successfully`);
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );
      } else {
        toast.error(result.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('An error occurred while updating booking status');
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  // Handle payment processing
  const handlePayment = async (bookingId, paymentMethod = 'online') => {
    setActionLoading((prev) => ({ ...prev, [`payment_${bookingId}`]: true }));

    try {
      const result = await processPayment(bookingId, {
        paymentMethod,
        transactionId: `TXN_${Date.now()}`, // Mock transaction ID
      });

      if (result.success) {
        toast.success(result.message || 'Payment processed successfully');
        fetchBookings(); // Refresh bookings
      } else {
        toast.error(result.message || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('An error occurred while processing payment');
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`payment_${bookingId}`]: false,
      }));
    }
  };

  // Handle adding note
  const handleAddNote = async () => {
    if (!noteContent.trim() || !selectedBooking) return;

    try {
      const result = await addBookingNote(selectedBooking._id, noteContent);

      if (result.success) {
        toast.success('Note added successfully');
        setNoteContent('');
        setShowNoteModal(false);
        fetchBookings(); // Refresh to show updated notes
      } else {
        toast.error(result.message || 'Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('An error occurred while adding note');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <button
          onClick={() => fetchBookings(true)}
          disabled={refreshing}
          className={`flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition duration-200 ${
            refreshing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FiRefreshCw
            className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No Bookings Found
          </h2>
          <p className="text-gray-500">
            You haven&apos;t made any bookings yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="md:flex">
                {/* Property Image */}
                <div className="md:w-1/3">
                  <img
                    src={
                      booking.property?.images?.[0] ||
                      '/api/placeholder/300/200'
                    }
                    alt={booking.property?.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>

                {/* Booking Details */}
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {booking.property?.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <FiMapPin className="w-4 h-4 mr-1" />
                        {booking.property?.location}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status?.charAt(0).toUpperCase() +
                          booking.status?.slice(1)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                          booking.payment?.status
                        )}`}
                      >
                        Payment:{' '}
                        {booking.payment?.status?.charAt(0).toUpperCase() +
                          booking.payment?.status?.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Booking Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Check-in</p>
                        <p className="text-sm font-medium">
                          {formatDate(booking.bookingDetails?.checkInDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Check-out</p>
                        <p className="text-sm font-medium">
                          {formatDate(booking.bookingDetails?.checkOutDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">People</p>
                        <p className="text-sm font-medium">
                          {booking.bookingDetails?.numberOfPeople}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiDollarSign className="w-4 h-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-sm font-medium">
                          Rs. {booking.payment?.amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Duration and Use Type */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        {booking.bookingDetails?.duration} months
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Use: {booking.bookingDetails?.useType}
                    </div>
                    {booking.bookingDetails?.hasPets && (
                      <div className="text-sm text-gray-600">🐾 Has pets</div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div>Name: {booking.contactInfo?.name}</div>
                      <div>Email: {booking.contactInfo?.email}</div>
                      <div>Phone: {booking.contactInfo?.phone}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {/* For buyers */}
                    {userRole === 'buyer' && (
                      <>
                        {booking.status === 'pending' &&
                          booking.payment?.status === 'pending' && (
                            <button
                              onClick={() => handlePayment(booking._id)}
                              disabled={actionLoading[`payment_${booking._id}`]}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
                            >
                              {actionLoading[`payment_${booking._id}`]
                                ? 'Processing...'
                                : 'Pay Now'}
                            </button>
                          )}
                        {booking.status === 'pending' && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, 'cancelled')
                            }
                            disabled={actionLoading[booking._id]}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50"
                          >
                            {actionLoading[booking._id]
                              ? 'Cancelling...'
                              : 'Cancel'}
                          </button>
                        )}
                      </>
                    )}

                    {/* For sellers */}
                    {userRole === 'seller' && (
                      <>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking._id, 'confirmed')
                              }
                              disabled={actionLoading[booking._id]}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50 flex items-center"
                            >
                              <FiCheck className="w-4 h-4 mr-1" />
                              {actionLoading[booking._id]
                                ? 'Confirming...'
                                : 'Confirm'}
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking._id, 'rejected')
                              }
                              disabled={actionLoading[booking._id]}
                              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50 flex items-center"
                            >
                              <FiX className="w-4 h-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, 'completed')
                            }
                            disabled={actionLoading[booking._id]}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                          >
                            {actionLoading[booking._id]
                              ? 'Completing...'
                              : 'Mark Complete'}
                          </button>
                        )}
                      </>
                    )}

                    {/* Add Note Button */}
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowNoteModal(true);
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200 flex items-center"
                    >
                      <FiMessageSquare className="w-4 h-4 mr-1" />
                      Add Note
                    </button>
                  </div>

                  {/* Notes */}
                  {booking.notes && booking.notes.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {booking.notes.map((note, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-2 rounded text-sm"
                          >
                            <p className="text-gray-700">{note.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {note.addedBy?.name} - {formatDate(note.addedAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Note</h3>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Enter your note..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteContent('');
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!noteContent.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

BookingList.propTypes = {
  userRole: PropTypes.oneOf(['buyer', 'seller', 'admin']),
};

export default BookingList;
