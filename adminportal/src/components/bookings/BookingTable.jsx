import { useState } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ConfirmDialog from '../shared/ConfirmDialog';
import Modal from '../shared/Modal';
import toast from 'react-hot-toast';
import BookingTableRow from './BookingTableRow';
import ViewBookingModal from './ViewBookingModal';
import EditBookingForm from './EditBookingForm';
import { filterBookings, paginateBookings, initializeFormData } from './bookingUtils';
import PropTypes from 'prop-types';

const BookingTable = ({ bookings: initialBookings, isDark }) => {
  // State management
  const [bookings, setBookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState(initializeFormData());

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle edit booking submission
  const handleEditBooking = (e) => {
    e.preventDefault();
    setBookings(prev => prev.map(booking => 
      booking.id === selectedBooking.id ? { ...booking, ...formData } : booking
    ));
    setShowEditModal(false);
    toast.success('Booking updated successfully');
  };

  // Handle delete booking
  const handleDelete = () => {
    setBookings(prev => prev.filter(booking => booking.id !== selectedBooking.id));
    setShowDeleteDialog(false);
    toast.success('Booking deleted successfully');
  };

  // Filter and paginate bookings
  const filteredBookings = filterBookings(bookings, searchTerm, paymentStatusFilter);
  const { paginatedBookings, totalPages } = paginateBookings(
    filteredBookings, 
    currentPage, 
    itemsPerPage
  );

  // Handle view/edit/delete actions
  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setFormData(initializeFormData(booking));
    setShowEditModal(true);
  };

  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteDialog(true);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search bookings..."
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            className={`px-4 py-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20`}
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl overflow-hidden shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  Buyer
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  Property ID
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  Check-in Date
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  Duration
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  Amount
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-right text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <BookingTableRow
                    key={booking.id}
                    booking={booking}
                    isDark={isDark}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={`px-6 py-12 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mb-4`}>
                        <FiSearch className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium mb-2">No bookings found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredBookings.length > 0 && (
          <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} results
                </span>
                
                <select 
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                  className={`px-3 py-1 rounded border text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? isDark ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                      : isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                        : isDark 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? isDark ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                      : isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* View Booking Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Booking Details"
        isDark={isDark}
      >
        <ViewBookingModal 
          booking={selectedBooking} 
          onClose={() => setShowViewModal(false)}
          isDark={isDark}
        />
      </Modal>

      {/* Edit Booking Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Booking"
        isDark={isDark}
      >
        <EditBookingForm 
          formData={formData}
          isDark={isDark}
          handleInputChange={handleInputChange}
          onSubmit={handleEditBooking}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        isDark={isDark}
      />
    </div>
  );
};

BookingTable.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      buyerName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      propertyId: PropTypes.string.isRequired,
      checkInDate: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      totalAmount: PropTypes.number.isRequired,
      paymentStatus: PropTypes.oneOf(['paid', 'pending']).isRequired,
      bookingDate: PropTypes.string.isRequired
    })
  ).isRequired,
  isDark: PropTypes.bool.isRequired
};

BookingTable.defaultProps = {
  bookings: [],
  isDark: false
};

export default BookingTable;