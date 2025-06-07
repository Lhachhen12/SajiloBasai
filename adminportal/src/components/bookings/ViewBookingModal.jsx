import PropTypes from 'prop-types';

const ViewBookingModal = ({ booking, onClose, isDark }) => {
  if (!booking) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Buyer Name
          </label>
          <p className={`px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {booking.buyerName}
          </p>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Email
          </label>
          <p className={`px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {booking.email}
          </p>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Property ID
          </label>
          <p className={`px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {booking.propertyId}
          </p>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Check-in Date
          </label>
          <p className={`px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {new Date(booking.checkInDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Duration (months)
          </label>
          <p className={`px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {booking.duration}
          </p>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Total Amount
          </label>
          <p className={`px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
            ${parseFloat(booking.totalAmount).toFixed(2)}
          </p>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Payment Status
          </label>
          <p className={`px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
          </p>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Booking Date
          </label>
          <p className={`px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {new Date(booking.bookingDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Close
        </button>
      </div>
    </div>
  );
};

ViewBookingModal.propTypes = {
  booking: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired
};

export default ViewBookingModal;