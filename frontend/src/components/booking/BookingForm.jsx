import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createBooking } from '../../api/bookingApi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const BookingForm = ({ property, onBookingSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: property?._id || '',
    contactInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
    },
    bookingDetails: {
      numberOfPeople: 1,
      hasPets: false,
      useType: 'personal',
      message: '',
      checkInDate: '',
      checkOutDate: '',
      duration: 1,
    },
    paymentMethod: 'online',
  });

  const [errors, setErrors] = useState({});

  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');

    if (keys.length === 2) {
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Calculate check-out date when check-in date or duration changes
  useEffect(() => {
    if (
      formData.bookingDetails.checkInDate &&
      formData.bookingDetails.duration
    ) {
      const checkInDate = new Date(formData.bookingDetails.checkInDate);
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setMonth(
        checkOutDate.getMonth() + parseInt(formData.bookingDetails.duration)
      );

      setFormData((prev) => ({
        ...prev,
        bookingDetails: {
          ...prev.bookingDetails,
          checkOutDate: checkOutDate.toISOString().split('T')[0],
        },
      }));
    }
  }, [formData.bookingDetails.checkInDate, formData.bookingDetails.duration]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Contact info validation
    if (!formData.contactInfo.name.trim()) {
      newErrors['contactInfo.name'] = 'Name is required';
    }
    if (!formData.contactInfo.email.trim()) {
      newErrors['contactInfo.email'] = 'Email is required';
    }
    if (!formData.contactInfo.phone.trim()) {
      newErrors['contactInfo.phone'] = 'Phone is required';
    }

    // Booking details validation
    if (!formData.bookingDetails.checkInDate) {
      newErrors['bookingDetails.checkInDate'] = 'Check-in date is required';
    }
    if (formData.bookingDetails.numberOfPeople < 1) {
      newErrors['bookingDetails.numberOfPeople'] = 'At least 1 person required';
    }
    if (formData.bookingDetails.duration < 1) {
      newErrors['bookingDetails.duration'] =
        'Duration must be at least 1 month';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    try {
      const result = await createBooking(formData);

      if (result.success) {
        toast.success(result.message || 'Booking created successfully!');
        onBookingSuccess?.(result.booking);
      } else {
        toast.error(result.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      toast.error('An error occurred while creating the booking');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = property?.price * formData.bookingDetails.duration || 0;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Property</h2>

      {/* Property Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">{property?.title}</h3>
        <p className="text-gray-600 mb-2">{property?.location}</p>
        <p className="text-xl font-bold text-blue-600">
          Rs. {property?.price?.toLocaleString()}/month
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="contactInfo.name"
                value={formData.contactInfo.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['contactInfo.name']
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors['contactInfo.name'] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors['contactInfo.name']}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="contactInfo.email"
                value={formData.contactInfo.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['contactInfo.email']
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors['contactInfo.email'] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors['contactInfo.email']}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="contactInfo.phone"
              value={formData.contactInfo.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors['contactInfo.phone']
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
            {errors['contactInfo.phone'] && (
              <p className="text-red-500 text-sm mt-1">
                {errors['contactInfo.phone']}
              </p>
            )}
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Booking Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date *
              </label>
              <input
                type="date"
                name="bookingDetails.checkInDate"
                value={formData.bookingDetails.checkInDate}
                onChange={handleInputChange}
                min={today}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['bookingDetails.checkInDate']
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors['bookingDetails.checkInDate'] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors['bookingDetails.checkInDate']}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (months) *
              </label>
              <input
                type="number"
                name="bookingDetails.duration"
                value={formData.bookingDetails.duration}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['bookingDetails.duration']
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors['bookingDetails.duration'] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors['bookingDetails.duration']}
                </p>
              )}
            </div>
          </div>

          {formData.bookingDetails.checkOutDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>
              <input
                type="date"
                value={formData.bookingDetails.checkOutDate}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of People *
              </label>
              <input
                type="number"
                name="bookingDetails.numberOfPeople"
                value={formData.bookingDetails.numberOfPeople}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['bookingDetails.numberOfPeople']
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {errors['bookingDetails.numberOfPeople'] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors['bookingDetails.numberOfPeople']}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Use Type *
              </label>
              <select
                name="bookingDetails.useType"
                value={formData.bookingDetails.useType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="personal">Personal</option>
                <option value="family">Family</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasPets"
              name="bookingDetails.hasPets"
              checked={formData.bookingDetails.hasPets}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="hasPets"
              className="ml-2 block text-sm text-gray-700"
            >
              I have pets
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Message
            </label>
            <textarea
              name="bookingDetails.message"
              value={formData.bookingDetails.message}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional information or special requests..."
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Payment Method
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['online', 'cash', 'bank_transfer'].map((method) => (
              <label
                key={method}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                  {method.replace('_', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Booking Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{formData.bookingDetails.duration} months</span>
            </div>
            <div className="flex justify-between">
              <span>Price per month:</span>
              <span>Rs. {property?.price?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total Amount:</span>
              <span>Rs. {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 px-4 py-2 text-white rounded-md transition duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating Booking...' : 'Book Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

BookingForm.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
    price: PropTypes.number,
  }),
  onBookingSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

BookingForm.defaultProps = {
  property: null,
  onBookingSuccess: () => {},
  onCancel: () => {},
};

export default BookingForm;
