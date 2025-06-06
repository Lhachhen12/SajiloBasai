import { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AddBooking = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      addBooking(bookingData);
      toast.success('Booking created successfully!');
      navigate('/bookings');
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Booking</h1>
        <p className="text-sm text-gray-500">Create a new manual booking entry</p>
      </div>

      <div className="bg-white rounded-lg shadow-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buyer Name
              </label>
              <input
                type="text"
                name="buyerName"
                value={bookingData.buyerName}
                onChange={handleChange}
                className="form-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={bookingData.email}
                onChange={handleChange}
                className="form-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={bookingData.phone}
                onChange={handleChange}
                className="form-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property ID
              </label>
              <input
                type="text"
                name="propertyId"
                value={bookingData.propertyId}
                onChange={handleChange}
                className="form-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <input
                type="date"
                name="checkInDate"
                value={bookingData.checkInDate}
                onChange={handleChange}
                className="form-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (months)
              </label>
              <input
                type="number"
                name="duration"
                value={bookingData.duration}
                onChange={handleChange}
                className="form-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount
              </label>
              <input
                type="number"
                name="totalAmount"
                value={bookingData.totalAmount}
                onChange={handleChange}
                className="form-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={bookingData.paymentMethod}
                onChange={handleChange}
                className="form-select w-full"
                required
              >
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary flex items-center"
            >
              <FiSave className="mr-2" />
              Save Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBooking;