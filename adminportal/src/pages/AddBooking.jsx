import { useState, useEffect } from 'react';
import {
  FiSave,
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiHome,
  FiRefreshCw,
  FiPhone,
  FiMail,
  FiMapPin,
  FiChevronRight,
  FiChevronLeft,
  FiCheck,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getProperties, getUsers, createBookingAdmin } from '../utils/adminApi';
import ConfirmDialog from '../shared/ConfirmDialog';
import toast from 'react-hot-toast';

const AddBooking = ({ isDark }) => {
  const navigate = useNavigate();
  const { properties: contextProperties, users: contextUsers } =
    useAppContext();

  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Updated booking data structure to match the backend model
  const [bookingData, setBookingData] = useState({
    propertyId: '',
    buyerId: '',
    sellerId: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
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
    payment: {
      method: 'cash',
      status: 'pending',
      amount: 0,
      transactionId: '',
      paymentDate: null,
    },
    status: 'pending',
    notes: '',
    adminNotes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    try {
      setLoading(true);
      let loadedProperties = [];
      let loadedUsers = [];

      // Use context data first, then fetch if needed
      if (contextProperties && contextProperties.length > 0) {
        setProperties(contextProperties);
        loadedProperties = contextProperties;
      } else {
        console.log('Fetching properties...');
        const propertiesResult = await getProperties();
        console.log('Properties result:', propertiesResult);
        if (propertiesResult?.success) {
          const props = propertiesResult.data || [];
          setProperties(props);
          loadedProperties = props;
        } else {
          console.error('Failed to get properties:', propertiesResult);
          setProperties([]);
          loadedProperties = [];
        }
      }

      if (contextUsers && contextUsers.length > 0) {
        setUsers(contextUsers);
        loadedUsers = contextUsers;
      } else {
        console.log('Fetching users...');
        const usersResult = await getUsers();
        console.log('Users result:', usersResult);
        if (usersResult?.success) {
          const usrs = usersResult.data || [];
          setUsers(usrs);
          loadedUsers = usrs;
        } else {
          console.error('Failed to get users:', usersResult);
          setUsers([]);
          loadedUsers = [];
        }
      }

      // Show appropriate toast messages based on loaded data
      if (loadedProperties.length > 0 && loadedUsers.length > 0) {
        toast.success(
          `Loaded ${loadedProperties.length} properties and ${loadedUsers.length} users`
        );
      } else if (loadedProperties.length === 0 && loadedUsers.length > 0) {
        toast.error('No properties found - please add some properties first');
      } else if (loadedProperties.length > 0 && loadedUsers.length === 0) {
        toast.error('No users found - please check your user data');
      } else if (loadedProperties.length === 0 && loadedUsers.length === 0) {
        toast.error('No properties or users found - please add data first');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data: ' + error.message);
      // Set empty arrays as fallback
      setProperties([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    if (section) {
      setBookingData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setBookingData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Auto-calculate checkout date and amount when relevant fields change
  useEffect(() => {
    if (
      bookingData.bookingDetails.checkInDate &&
      bookingData.bookingDetails.duration
    ) {
      const checkInDate = new Date(bookingData.bookingDetails.checkInDate);
      const checkOutDate = new Date(checkInDate);

      // Add months properly - handle edge cases
      const monthsToAdd = parseInt(bookingData.bookingDetails.duration);
      checkOutDate.setMonth(checkOutDate.getMonth() + monthsToAdd);

      // If we went to an invalid date (like Feb 30), setMonth adjusts it
      // Make sure we get a valid date string
      const checkOutDateString = checkOutDate.toISOString().split('T')[0];

      console.log('Calculating checkout date:');
      console.log('Check-in date:', bookingData.bookingDetails.checkInDate);
      console.log('Duration (months):', monthsToAdd);
      console.log('Calculated checkout date:', checkOutDateString);

      setBookingData((prev) => ({
        ...prev,
        bookingDetails: {
          ...prev.bookingDetails,
          checkOutDate: checkOutDateString,
        },
      }));
    }
  }, [
    bookingData.bookingDetails.checkInDate,
    bookingData.bookingDetails.duration,
  ]);

  console.log(bookingData);

  useEffect(() => {
    if (bookingData.propertyId && bookingData.bookingDetails.duration) {
      const selectedProperty = properties.find(
        (p) => p._id === bookingData.propertyId
      );
      if (selectedProperty) {
        const amount =
          selectedProperty.price *
          parseInt(bookingData.bookingDetails.duration);
        setBookingData((prev) => ({
          ...prev,
          payment: {
            ...prev.payment,
            amount: amount,
          },
        }));
      }
    }
  }, [bookingData.propertyId, bookingData.bookingDetails.duration, properties]);

  // Validation for each step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          bookingData.contactInfo.name &&
          bookingData.contactInfo.email &&
          bookingData.contactInfo.phone
        );
      case 2:
        return (
          bookingData.propertyId &&
          bookingData.buyerId &&
          bookingData.sellerId &&
          bookingData.bookingDetails.numberOfPeople &&
          bookingData.bookingDetails.useType &&
          bookingData.bookingDetails.checkInDate &&
          bookingData.bookingDetails.checkOutDate &&
          bookingData.bookingDetails.duration
        );
      case 3:
        return bookingData.payment.amount && bookingData.payment.method;
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast.error('Please fill in all required fields before proceeding');
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setShowConfirm(true);
  };

  const handleConfirmReset = () => {
    setBookingData({
      propertyId: '',
      buyerId: '',
      sellerId: '',
      contactInfo: {
        name: '',
        email: '',
        phone: '',
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
      payment: {
        method: 'cash',
        status: 'pending',
        amount: 0,
        transactionId: '',
        paymentDate: null,
      },
      status: 'pending',
      notes: '',
      adminNotes: '',
    });
    setCurrentStep(1);
    setShowConfirm(false);
    toast.success('Form reset successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Create the booking data to match the backend API
      const submissionData = {
        propertyId: bookingData.propertyId,
        buyerId: bookingData.buyerId,
        sellerId: bookingData.sellerId,
        contactInfo: bookingData.contactInfo,
        bookingDetails: {
          numberOfPeople: bookingData.bookingDetails.numberOfPeople,
          hasPets: bookingData.bookingDetails.hasPets,
          useType: bookingData.bookingDetails.useType,
          message: bookingData.bookingDetails.message,
          checkInDate: bookingData.bookingDetails.checkInDate,
          checkOutDate: bookingData.bookingDetails.checkOutDate,
          duration: bookingData.bookingDetails.duration,
        },
        payment: bookingData.payment,
        status: bookingData.status,
        notes: [],
      };

      // Add admin notes if provided
      if (bookingData.adminNotes?.trim()) {
        submissionData.notes.push({
          content: `Admin Note: ${bookingData.adminNotes}`,
        });
      }

      // Add additional notes if provided
      if (bookingData.notes?.trim()) {
        submissionData.notes.push({
          content: bookingData.notes,
        });
      }

      // Debug log to see what's being sent
      console.log('=== BOOKING SUBMISSION DEBUG ===');
      console.log('Original booking data:', bookingData);
      console.log('Submission data:', submissionData);
      console.log('Check-in date:', submissionData.bookingDetails.checkInDate);
      console.log(
        'Check-out date:',
        submissionData.bookingDetails.checkOutDate
      );
      console.log('Duration:', submissionData.bookingDetails.duration);
      console.log('================================');

      const result = await createBookingAdmin(submissionData);

      if (result.success) {
        toast.success(result.message || 'Booking created successfully!');
        navigate('/bookings');
      } else {
        throw new Error(result.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
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

  const requiredLabelStyles = `block text-sm font-medium mb-2 ${
    isDark ? 'text-gray-300' : 'text-gray-700'
  }`;

  const optionalLabelStyles = `block text-sm font-medium mb-2 ${
    isDark ? 'text-gray-400' : 'text-gray-500'
  }`;

  // Step indicator component
  const StepIndicator = ({ currentStep, totalSteps, stepTitles }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isValidated = validateStep(stepNumber);

          return (
            <div
              key={stepNumber}
              className="flex items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? isValidated
                        ? 'bg-blue-500 text-white'
                        : 'bg-red-500 text-white'
                      : isDark
                      ? 'bg-gray-600 text-gray-300'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? <FiCheck className="h-5 w-5" /> : stepNumber}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive
                      ? isDark
                        ? 'text-white'
                        : 'text-gray-900'
                      : isDark
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                >
                  {title}
                </span>
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={`w-16 h-0.5 mx-4 ${
                    isCompleted
                      ? 'bg-green-500'
                      : isDark
                      ? 'bg-gray-600'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const stepTitles = [
    'Contact Info',
    'Property & People',
    'Payment',
    'Additional Info',
  ];

  // Filter users by role
  const buyers = users.filter(
    (user) => user.role === 'buyer' || user.role === 'user'
  );
  const sellers = users.filter(
    (user) => user.role === 'seller' || user.role === 'admin'
  );

  if (loading && properties.length === 0 && users.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Loading form data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmReset}
        title="Reset Form"
        message="Are you sure you want to reset all fields? All entered data will be lost."
        isDark={isDark}
      />

      <div className="mb-8">
        <h1
          className={`text-3xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          } mb-2`}
        >
          Add New Booking
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
          Fill out the booking details step by step. Fields marked with{' '}
          <span className="text-red-500">*</span> are required.
        </p>

        {/* Debug info - remove in production */}
        <div
          className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          } mb-4`}
        >
          Debug: Properties loaded: {properties.length}, Users loaded:{' '}
          {users.length}
        </div>

        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mb-8"></div>

        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepTitles={stepTitles}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className={cardStyles}>
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg">
                <FiUser className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h2 className={sectionTitleStyles}>Contact Information</h2>
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Basic contact details for the booking
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={requiredLabelStyles}>
                  <FiUser className="inline-block mr-1" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bookingData.contactInfo.name}
                  onChange={(e) =>
                    handleChange('contactInfo', 'name', e.target.value)
                  }
                  className={inputStyles}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className={requiredLabelStyles}>
                  <FiMail className="inline-block mr-1" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={bookingData.contactInfo.email}
                  onChange={(e) =>
                    handleChange('contactInfo', 'email', e.target.value)
                  }
                  className={inputStyles}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className={requiredLabelStyles}>
                  <FiPhone className="inline-block mr-1" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={bookingData.contactInfo.phone}
                  onChange={(e) =>
                    handleChange('contactInfo', 'phone', e.target.value)
                  }
                  className={inputStyles}
                  required
                  placeholder="+977-9841234567"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Property & People */}
        {currentStep === 2 && (
          <div className={cardStyles}>
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 shadow-lg">
                <FiHome className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h2 className={sectionTitleStyles}>Property & People</h2>
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Select property, buyer, seller and booking details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={requiredLabelStyles}>
                  <FiHome className="inline-block mr-1" />
                  Property <span className="text-red-500">*</span>
                  {properties.length > 0 && (
                    <span className="text-green-500 text-xs ml-2">
                      ({properties.length} available)
                    </span>
                  )}
                </label>
                <select
                  value={bookingData.propertyId}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      propertyId: e.target.value,
                      sellerId:
                        properties.find((p) => p._id === e.target.value)
                          ?.sellerId?._id || '',
                    }))
                  }
                  className={inputStyles}
                  required
                >
                  <option value="">Select a property</option>
                  {properties.map((property) => (
                    <option
                      key={property._id || property.id}
                      value={property._id || property.id}
                    >
                      {property.title || property.name} - {property.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={requiredLabelStyles}>
                  <FiUser className="inline-block mr-1" />
                  Buyer <span className="text-red-500">*</span>
                  {buyers.length > 0 && (
                    <span className="text-green-500 text-xs ml-2">
                      ({buyers.length} available)
                    </span>
                  )}
                </label>
                <select
                  value={bookingData.buyerId}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      buyerId: e.target.value,
                    }))
                  }
                  className={inputStyles}
                  required
                >
                  <option value="">Select buyer</option>
                  {buyers.map((user) => (
                    <option
                      key={user._id}
                      value={user._id}
                    >
                      {user.name} - {user.email} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={requiredLabelStyles}>
                  <FiUser className="inline-block mr-1" />
                  Seller <span className="text-red-500">*</span>
                  {sellers.length > 0 && (
                    <span className="text-green-500 text-xs ml-2">
                      ({sellers.length} available)
                    </span>
                  )}
                </label>
                <select
                  value={bookingData.sellerId}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      sellerId: e.target.value,
                    }))
                  }
                  className={inputStyles}
                  required
                >
                  <option value="">Select seller</option>
                  {sellers.map((user) => (
                    <option
                      key={user._id}
                      value={user._id}
                    >
                      {user.name} - {user.email} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={requiredLabelStyles}>
                  Number of People <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={bookingData.bookingDetails.numberOfPeople}
                  onChange={(e) =>
                    handleChange(
                      'bookingDetails',
                      'numberOfPeople',
                      e.target.value
                    )
                  }
                  className={inputStyles}
                  required
                />
              </div>

              <div>
                <label className={requiredLabelStyles}>
                  Use Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={bookingData.bookingDetails.useType}
                  onChange={(e) =>
                    handleChange('bookingDetails', 'useType', e.target.value)
                  }
                  className={inputStyles}
                  required
                >
                  <option value="personal">Personal</option>
                  <option value="family">Family</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <label className={requiredLabelStyles}>
                  <FiCalendar className="inline-block mr-1" />
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={today}
                  value={bookingData.bookingDetails.checkInDate}
                  onChange={(e) =>
                    handleChange(
                      'bookingDetails',
                      'checkInDate',
                      e.target.value
                    )
                  }
                  className={inputStyles}
                  required
                />
              </div>

              <div>
                <label className={requiredLabelStyles}>
                  Duration (months) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g., 6"
                  value={bookingData.bookingDetails.duration}
                  onChange={(e) =>
                    handleChange(
                      'bookingDetails',
                      'duration',
                      parseInt(e.target.value) || 1
                    )
                  }
                  className={inputStyles}
                  required
                />
                {bookingData.bookingDetails.checkOutDate && (
                  <p className="text-sm text-green-600 mt-1">
                    Check-out date: {bookingData.bookingDetails.checkOutDate}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasPets"
                  checked={bookingData.bookingDetails.hasPets}
                  onChange={(e) =>
                    handleChange('bookingDetails', 'hasPets', e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label
                  htmlFor="hasPets"
                  className="ml-2 text-sm"
                >
                  Has pets
                </label>
              </div>

              <div className="md:col-span-2">
                <label className={labelStyles}>Message/Special Requests</label>
                <textarea
                  value={bookingData.bookingDetails.message}
                  onChange={(e) =>
                    handleChange('bookingDetails', 'message', e.target.value)
                  }
                  className={inputStyles}
                  rows="3"
                  placeholder="Any special requests or additional information..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className={cardStyles}>
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                <FiCreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h2 className={sectionTitleStyles}>Payment Information</h2>
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Enter payment details and amount
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={requiredLabelStyles}>
                  <FiDollarSign className="inline-block mr-1" />
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={bookingData.payment.amount}
                  onChange={(e) =>
                    handleChange('payment', 'amount', e.target.value)
                  }
                  className={inputStyles}
                  required
                  placeholder="50000"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className={requiredLabelStyles}>
                  <FiCreditCard className="inline-block mr-1" />
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={bookingData.payment.method}
                  onChange={(e) =>
                    handleChange('payment', 'method', e.target.value)
                  }
                  className={inputStyles}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="online">Online Payment</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className={requiredLabelStyles}>
                  Payment Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={bookingData.payment.status}
                  onChange={(e) =>
                    handleChange('payment', 'status', e.target.value)
                  }
                  className={inputStyles}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className={labelStyles}>Transaction ID</label>
                <input
                  type="text"
                  value={bookingData.payment.transactionId}
                  onChange={(e) =>
                    handleChange('payment', 'transactionId', e.target.value)
                  }
                  className={inputStyles}
                  placeholder="TXN123456789"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Additional Information */}
        {currentStep === 4 && (
          <div className={cardStyles}>
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                <FiSave className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h2 className={sectionTitleStyles}>Additional Information</h2>
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Optional details to complete the booking (all fields are
                  optional)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={optionalLabelStyles}>Booking Status</label>
                <select
                  value={bookingData.status}
                  onChange={(e) => handleChange(null, 'status', e.target.value)}
                  className={inputStyles}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={optionalLabelStyles}>
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={bookingData.adminNotes}
                  onChange={(e) =>
                    handleChange(null, 'adminNotes', e.target.value)
                  }
                  className={inputStyles}
                  rows="3"
                  placeholder="Internal admin notes..."
                />
              </div>

              <div className="md:col-span-2">
                <label className={optionalLabelStyles}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => handleChange(null, 'notes', e.target.value)}
                  className={inputStyles}
                  rows="3"
                  placeholder="Any additional notes or information..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation and Actions */}
        <div className={cardStyles}>
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-3 flex items-center justify-center rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <FiChevronLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className={`px-6 py-3 flex items-center justify-center rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <FiRefreshCw className="h-5 w-5 mr-2" />
                Reset
              </button>
            </div>

            <div className="flex gap-3">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className={`px-6 py-3 flex items-center justify-center rounded-lg transition-colors ${
                    validateStep(currentStep)
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  } disabled:opacity-50`}
                >
                  Next
                  <FiChevronRight className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !validateStep(1) ||
                    !validateStep(2) ||
                    !validateStep(3)
                  }
                  className="px-6 py-3 flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiSave className="h-5 w-5 mr-2" />
                      Create Booking
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 text-center">
            <span
              className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBooking;
