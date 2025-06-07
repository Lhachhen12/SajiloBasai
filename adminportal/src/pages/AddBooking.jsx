import { useState } from 'react';
import { FiSave, FiUser, FiCalendar, FiCreditCard, FiDollarSign, FiHome, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ConfirmDialog from '../shared/ConfirmDialog';
import toast from 'react-hot-toast';

const AddBooking = ({ isDark }) => {
  const navigate = useNavigate();
  const { addBooking } = useAppContext();
  
  const [bookingData, setBookingData] = useState({
    buyerName: '',
    email: '',
    phone: '',
    propertyId: '',
    checkInDate: '',
    duration: '',
    totalAmount: '',
    paymentMethod: 'cash',
    paymentStatus: 'paid'
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setShowConfirm(true);
  };

  const handleConfirmReset = () => {
    setBookingData({
      buyerName: '',
      email: '',
      phone: '',
      propertyId: '',
      checkInDate: '',
      duration: '',
      totalAmount: '',
      paymentMethod: 'cash',
      paymentStatus: 'paid'
    });
    setShowConfirm(false);
    toast.success('Form reset successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.buyerName || !bookingData.email || !bookingData.phone || !bookingData.propertyId || !bookingData.checkInDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      addBooking({
        ...bookingData,
        bookingDate: new Date().toLocaleDateString(),
        status: 'Confirmed'
      });
      toast.success('Booking created successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        icon: '✅'
      });
      navigate('/bookings');
    } catch (error) {
      toast.error('Failed to create booking', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        icon: '❌'
      });
    }
  };

  // Styles for dark/light mode
  const inputStyles = `w-full px-4 py-3 rounded-lg border transition-colors ${
    isDark 
      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
  } focus:ring-2 focus:ring-blue-500/20`;

  const cardStyles = `rounded-xl shadow-lg p-6 transition-colors ${
    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  } border`;

  const labelStyles = `block text-sm font-medium mb-2 ${
    isDark ? 'text-gray-300' : 'text-gray-700'
  }`;

  const sectionTitleStyles = `text-lg font-medium ${
    isDark ? 'text-white' : 'text-gray-900'
  }`;

  return (
    <div className="p-6">
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmReset}
        title="Reset Form"
        message="Are you sure you want to reset all fields? All entered data will be lost."
        isDark={isDark}
      />

      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          Add New Booking
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className={cardStyles}>
          <div className="flex items-center mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg`}>
              <FiCalendar className="h-5 w-5 text-white" />
            </div>
            <h2 className={`${sectionTitleStyles} ml-3`}>Booking Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyer Information */}
            <div>
              <label className={labelStyles}>
                <FiUser className="inline-block mr-1" />
                Buyer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="buyerName"
                value={bookingData.buyerName}
                onChange={handleChange}
                className={inputStyles}
                required
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className={labelStyles}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={bookingData.email}
                onChange={handleChange}
                className={inputStyles}
                required
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className={labelStyles}>
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={bookingData.phone}
                onChange={handleChange}
                className={inputStyles}
                required
                placeholder="+1234567890"
              />
            </div>

            {/* Property Information */}
            <div>
              <label className={labelStyles}>
                <FiHome className="inline-block mr-1" />
                Property ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="propertyId"
                value={bookingData.propertyId}
                onChange={handleChange}
                className={inputStyles}
                required
                placeholder="PROP-12345"
              />
            </div>

            <div>
              <label className={labelStyles}>
                <FiCalendar className="inline-block mr-1" />
                Check-in Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="checkInDate"
                value={bookingData.checkInDate}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </div>

            <div>
              <label className={labelStyles}>
                Duration (months)
              </label>
              <input
                type="number"
                name="duration"
                value={bookingData.duration}
                onChange={handleChange}
                className={inputStyles}
                placeholder="12"
                min="1"
              />
            </div>

            {/* Payment Information */}
            <div>
              <label className={labelStyles}>
                <FiDollarSign className="inline-block mr-1" />
                Total Amount
              </label>
              <input
                type="number"
                name="totalAmount"
                value={bookingData.totalAmount}
                onChange={handleChange}
                className={inputStyles}
                placeholder="1200"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className={labelStyles}>
                <FiCreditCard className="inline-block mr-1" />
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={bookingData.paymentMethod}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="card">Credit/Debit Card</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-4 flex justify-between">
              <button
                type="button"
                onClick={handleReset}
                className={`px-6 py-3 flex items-center justify-center rounded-lg border transition-colors ${
                  isDark 
                    ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                <FiRefreshCw className="h-5 w-5 mr-2" />
                Reset Form
              </button>
              <button
                type="submit"
                className="px-6 py-3 flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiSave className="h-5 w-5 mr-2" />
                Save Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBooking;