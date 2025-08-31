import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getPropertyById } from "../../api/api";
import {
  createBooking,
  esewaBooking,
  processPayment,
} from "../../api/bookingApi";
import {
  FaCalendar,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPaw,
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
} from "react-icons/fa";
import toast from "react-hot-toast";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    hasPets: false,
    numberOfPeople: 1,
    useType: "personal",
    message: "",
    paymentMethod: "online",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: `/book/${id}`,
          message: "Please log in to book this property",
        },
      });
      return;
    }

    const loadProperty = async () => {
      try {
        const response = await getPropertyById(id);
        console.log("Property response:", response);
        if (response.success) {
          setProperty(response.property);
        } else {
          console.error("Failed to load property:", response.message);
          toast.error("Failed to load property details");
        }
      } catch (error) {
        console.error("Error loading property:", error);
        toast.error("Error loading property details");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const calculateTotalAmount = () => {
    if (!property) return 0;
    const baseAmount = property.price;
    const extraCharge = formData.paymentMethod === "cash" ? 300 : 0;
    return baseAmount + extraCharge;
  };

 // Updated booking functions in BookingPage.jsx

const handleSubmitEsewa = async (e) => {
  e.preventDefault();
  setProcessing(true);

  try {
    const duration = 1;
    const totalAmount = calculateTotalAmount();
    
    // Create future check-in date to avoid conflicts
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 1); // Start from tomorrow
    
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setMonth(checkOutDate.getMonth() + duration); // Add duration in months

    const bookingData = {
      propertyId: id,
      contactInfo: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      },
      bookingDetails: {
        numberOfPeople: parseInt(formData.numberOfPeople),
        hasPets: formData.hasPets,
        useType: formData.useType,
        message: formData.message.trim(),
        duration: duration,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
      },
      paymentMethod: formData.paymentMethod,
      amount: totalAmount,
      currency: 'NPR'
    };

    console.log("Creating eSewa booking with data:", bookingData);

    const bookingResponse = await esewaBooking(bookingData);
    console.log("eSewa Booking response:", bookingResponse);
    
    if (bookingResponse.success && bookingResponse.paymentUrl) {
      window.location.href = bookingResponse.paymentUrl;
    } else {
      // Show more specific error message
      const errorMessage = bookingResponse.message || "Failed to initialize eSewa payment";
      toast.error(errorMessage);
      console.error("eSewa booking failed:", bookingResponse);
    }
  } catch (error) {
    console.error("Error creating eSewa booking:", error);
    toast.error("Failed to create booking. Please try again.");
  } finally {
    setProcessing(false);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setProcessing(true);

  try {
    const duration = 1;
    const totalAmount = calculateTotalAmount();
    
    // Create future check-in date to avoid conflicts
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 1); // Start from tomorrow
    
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setMonth(checkOutDate.getMonth() + duration); // Add duration in months

    const bookingData = {
      propertyId: id,
      contactInfo: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      },
      bookingDetails: {
        numberOfPeople: parseInt(formData.numberOfPeople),
        hasPets: formData.hasPets,
        useType: formData.useType,
        message: formData.message.trim(),
        duration: duration,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
      },
      paymentMethod: formData.paymentMethod,
      amount: totalAmount,
      currency: 'NPR'
    };

    console.log("Creating booking with data:", bookingData);

    const bookingResponse = await createBooking(bookingData);
    console.log("Booking response:", bookingResponse);

    if (bookingResponse.success) {
      const bookingId = bookingResponse.booking._id || bookingResponse.booking.id;
      
      if (bookingId) {
        const paymentResponse = await processPayment(bookingId, formData.paymentMethod);
        
        if (paymentResponse.success) {
          toast.success("Your room has been successfully booked!");
          navigate("/buyer/bookings");
        } else {
          toast.error(paymentResponse.message || "Payment failed. Please try again.");
        }
      } else {
        toast.error("Invalid booking response. Please try again.");
      }
    } else {
      const errorMessage = bookingResponse.message || "Failed to create booking";
      toast.error(errorMessage);
      console.error("Booking creation failed:", bookingResponse);
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    toast.error("Failed to create booking. Please try again.");
  } finally {
    setProcessing(false);
  }
};
  if (loading) {
    return (
      <div className="pt-20 pb-12 min-h-screen bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-20 pb-12 min-h-screen bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Property Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The property you're trying to book doesn't exist.
              </p>
              <button
                onClick={() => navigate("/properties")}
                className="btn-primary"
              >
                Browse Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Property Summary */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    property.images?.[0] || property.imageUrl || "/room1.jpg"
                  }
                  alt={property.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-800 mb-1">
                    {property.title}
                  </h1>
                  <p className="text-gray-600">
                    {property.address?.city || property.location}
                  </p>
                  <p className="text-lg font-bold text-primary-600 mt-1">
                    NPR {property.price?.toLocaleString()} / per month
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form
              onSubmit={(e) => {
                if (formData.paymentMethod === "online") {
                  handleSubmitEsewa(e);
                } else {
                  handleSubmit(e);
                }
              }}
              className="p-6"
            >
              {" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="numberOfPeople" className="form-label">
                    Number of People
                  </label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      id="numberOfPeople"
                      name="numberOfPeople"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="useType" className="form-label">
                    Purpose of Stay
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      id="useType"
                      name="useType"
                      value={formData.useType}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      required
                    >
                      <option value="personal">Personal Use</option>
                      <option value="commercial">Office/Commercial Use</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasPets"
                    name="hasPets"
                    checked={formData.hasPets}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor="hasPets"
                    className="flex items-center text-gray-700"
                  >
                    <FaPaw className="mr-2 text-gray-400" />
                    Bringing Pets?
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="message" className="form-label">
                  Additional Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="input-field"
                  placeholder="Any special requirements or questions?"
                ></textarea>
              </div>
              {/* Payment Options */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Payment Method
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === "online"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600"
                    />
                    <div className="ml-3">
                      <span className="font-medium text-gray-900">
                        Online Payment (eSewa)
                      </span>
                      <p className="text-sm text-gray-500">
                        Pay NPR 500 as advance
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === "cash"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600"
                    />
                    <div className="ml-3">
                      <span className="font-medium text-gray-900">
                        Cash on Move-in
                      </span>
                      <p className="text-sm text-gray-500">
                        Additional NPR 300 charge applies
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              {/* Total Amount */}
              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Total Amount</h4>
                    <p className="text-sm text-gray-600">
                      {formData.paymentMethod === "cash"
                        ? "Including cash payment charge"
                        : "Advance payment required"}
                    </p>
                  </div>
                  <div className="text-xl font-bold text-primary-600">
                    NPR {calculateTotalAmount().toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center"
                  disabled={processing}
                >
                  <FaMoneyBillWave className="mr-2" />
                  <span>
                    {processing ? "Processing..." : "Confirm Booking"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
