import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import PropTypes from 'prop-types';

const BookingTableRow = ({ booking, isDark, onView, onEdit, onDelete }) => {
  return (
    <tr className={`transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
      <td className="px-6 py-4">
        <div>
          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {booking.buyerName}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {booking.email}
          </p>
        </div>
      </td>
      <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
        {booking.propertyId}
      </td>
      <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
        {new Date(booking.checkInDate).toLocaleDateString()}
      </td>
      <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
        {booking.duration} months
      </td>
      <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
        ${parseFloat(booking.totalAmount).toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          booking.paymentStatus === 'paid' 
            ? isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'
            : isDark ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {booking.paymentStatus ? 
            booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1) : 
            'Unknown'
          }
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onView(booking)}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400' 
                : 'hover:bg-blue-50 text-gray-500 hover:text-blue-600'
            }`}
            title="View booking"
          >
            <FiEye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(booking)}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-indigo-400' 
                : 'hover:bg-indigo-50 text-gray-500 hover:text-indigo-600'
            }`}
            title="Edit booking"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(booking)}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' 
                : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
            }`}
            title="Delete booking"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

BookingTableRow.propTypes = {
  booking: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default BookingTableRow;