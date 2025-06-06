import { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import ConfirmDialog from '../shared/ConfirmDialog';

const BookingTable = ({ bookings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = bookings.filter(booking => 
    booking.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.propertyId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    // Handle delete logic here
    setShowDeleteDialog(false);
  };

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search bookings..."
          className="form-input w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buyer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.buyerName}</div>
                  <div className="text-sm text-gray-500">{booking.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.propertyId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.checkInDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.duration} months
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${booking.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDeleteDialog(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
      />
    </div>
  );
};

export default BookingTable;