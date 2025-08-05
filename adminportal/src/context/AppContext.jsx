import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import toast from 'react-hot-toast';
import {
  adminApi,
  updateAdminProfile as updateAdminProfileApi,
  getAdminProfile,
} from '../utils/adminApi';

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user && user.role === 'admin') {
            setCurrentUser(user);
            // Fetch fresh profile data from API
            try {
              const profileResult = await getAdminProfile();
              if (profileResult) {
                setAdminProfile(profileResult);
                setCurrentUser(profileResult);
                // Update localStorage with fresh data
                localStorage.setItem('user', JSON.stringify(profileResult));
              }
            } catch (profileError) {
              console.error('Failed to fetch fresh profile:', profileError);
              // Keep using stored user data if API fails
              setAdminProfile(user);
            }
          } else {
            // Not an admin, clear credentials
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Authentication functions
  const login = async (email, password) => {
    try {
      const result = await adminApi.login(email, password);

      if (result.success && result.user && result.user.role === 'admin') {
        setCurrentUser(result.user);
        toast.success('Login successful!');
        return { success: true };
      } else if (
        result.success &&
        result.user &&
        result.user.role !== 'admin'
      ) {
        toast.error('Admin access required');
        return { success: false, message: 'Admin access required' };
      } else {
        toast.error('Login failed - Invalid response format');
        return { success: false, message: 'Invalid response format' };
      }
    } catch (error) {
      toast.error('Login failed');
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setAdminProfile(null);
    toast.success('Logged out successfully');
  };

  // Admin profile management
  const fetchAdminProfile = async () => {
    try {
      const result = await getAdminProfile();
      // getAdminProfile returns data directly, not wrapped in success object
      if (result) {
        setAdminProfile(result);
        setCurrentUser(result);
        return { success: true, data: result };
      }
      return { success: false, message: 'No profile data received' };
    } catch (error) {
      console.error('Failed to fetch admin profile:', error);
      return { success: false, message: error.message };
    }
  };

  const updateAdminProfile = async (profileData) => {
    try {
      const result = await updateAdminProfileApi(profileData);
      if (result.success) {
        setAdminProfile(result.data);
        setCurrentUser(result.data);
        // Update localStorage to keep it in sync
        localStorage.setItem('user', JSON.stringify(result.data));
        toast.success('Profile updated successfully');
        return result;
      } else {
        toast.error(result.message || 'Failed to update profile');
        return result;
      }
    } catch (error) {
      toast.error('Failed to update profile');
      return { success: false, message: error.message };
    }
  };

  const refreshAdminProfile = () => {
    return fetchAdminProfile();
  };

  // Property management
  const addProperty = async (property) => {
    try {
      const result = await adminApi.createProperty(property);
      if (result.success) {
        setProperties((prev) => [...prev, result.property]);
        toast.success('Property added successfully');
        return result;
      } else {
        toast.error(result.message || 'Failed to add property');
        return result;
      }
    } catch (error) {
      toast.error('Failed to add property');
      return { success: false, message: error.message };
    }
  };

  const updateProperty = async (id, updatedProperty) => {
    try {
      const result = await adminApi.updateProperty(id, updatedProperty);
      if (result.success) {
        setProperties((prev) =>
          prev.map((property) =>
            property.id === id ? result.property : property
          )
        );
        toast.success('Property updated successfully');
        return result;
      } else {
        toast.error(result.message || 'Failed to update property');
        return result;
      }
    } catch (error) {
      toast.error('Failed to update property');
      return { success: false, message: error.message };
    }
  };

  const deleteProperty = async (id) => {
    try {
      const result = await adminApi.deleteProperty(id);
      if (result.success) {
        setProperties((prev) => prev.filter((property) => property.id !== id));
        toast.success('Property deleted successfully');
        return result;
      } else {
        toast.error(result.message || 'Failed to delete property');
        return result;
      }
    } catch (error) {
      toast.error('Failed to delete property');
      return { success: false, message: error.message };
    }
  };

  // Booking management
  const addBooking = (booking) => {
    setBookings((prev) => [...prev, { ...booking, id: Date.now() }]);
    toast.success('Booking added successfully');
  };

  const updateBooking = async (id, updatedBooking) => {
    try {
      const result = await adminApi.updateBookingStatus(
        id,
        updatedBooking.status
      );
      if (result.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === id ? { ...booking, ...updatedBooking } : booking
          )
        );
        toast.success('Booking updated successfully');
        return result;
      } else {
        toast.error(result.message || 'Failed to update booking');
        return result;
      }
    } catch (error) {
      toast.error('Failed to update booking');
      return { success: false, message: error.message };
    }
  };

  const deleteBooking = (id) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
    toast.success('Booking deleted successfully');
  };

  // User management
  const fetchUsers = useCallback(
    async (page = 1, limit = 10, search = '', role = '', status = '') => {
      try {
        const result = await adminApi.getUserList(
          page,
          limit,
          search,
          role,
          status
        );
        setUsers(result.users || []);
        return result;
      } catch (error) {
        console.error('Failed to fetch users:', error);
        return {
          users: [],
          pagination: { currentPage: 1, totalPages: 1, total: 0, count: 0 },
        };
      }
    },
    []
  );

  const getUserDetails = async (userId) => {
    try {
      const result = await adminApi.getUserById(userId);
      return result;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      return { success: false, message: error.message };
    }
  };

  const addUser = async (userData) => {
    try {
      const result = await adminApi.createUser(userData);
      if (result.success) {
        setUsers((prev) => [result.user, ...prev]);
        toast.success('User created successfully');
        return result;
      } else {
        toast.error(result.message || 'Failed to create user');
        return result;
      }
    } catch (error) {
      toast.error('Failed to create user');
      return { success: false, message: error.message };
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const result = await adminApi.updateUser(userId, userData);
      if (result.success) {
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? result.user : user))
        );
        toast.success('User updated successfully');
        return result;
      } else {
        toast.error(result.message || 'Failed to update user');
        return result;
      }
    } catch (error) {
      toast.error('Failed to update user');
      return { success: false, message: error.message };
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const result = await adminApi.updateUserStatus(userId, status);
      if (result.success) {
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? { ...user, status } : user))
        );
        toast.success('User status updated successfully');
        return result;
      } else {
        toast.error(result.message || 'Failed to update user status');
        return result;
      }
    } catch (error) {
      toast.error('Failed to update user status');
      return { success: false, message: error.message };
    }
  };

  const deleteUser = async (userId) => {
    try {
      const result = await adminApi.deleteUser(userId);
      if (result.success) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        toast.success('User deleted successfully');
        return result;
      } else {
        toast.error(result.message || 'Failed to delete user');
        return result;
      }
    } catch (error) {
      toast.error('Failed to delete user');
      return { success: false, message: error.message };
    }
  };

  // Feedback management
  const respondToFeedback = async (feedbackId, response) => {
    try {
      const result = await adminApi.respondToFeedback(feedbackId, response);
      if (result.success) {
        setFeedback((prev) =>
          prev.map((item) => (item.id === feedbackId ? result.feedback : item))
        );
        toast.success('Response sent successfully');
        return result;
      } else {
        toast.error(result.message || 'Failed to send response');
        return result;
      }
    } catch (error) {
      toast.error('Failed to send response');
      return { success: false, message: error.message };
    }
  };

  // Data fetching functions
  const fetchProperties = useCallback(async () => {
    try {
      const data = await adminApi.getListings();
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    }
  }, []);

  const fetchBookings = useCallback(
    async (page = 1, limit = 10, status = '', paymentStatus = '') => {
      try {
        const data = await adminApi.getBookings(
          page,
          limit,
          status,
          paymentStatus
        );
        setBookings(data.bookings || []);
        return data;
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return { bookings: [], total: 0, totalPages: 1, currentPage: 1 };
      }
    },
    []
  );

  const fetchFeedback = useCallback(async () => {
    try {
      const data = await adminApi.getFeedback();
      setFeedback(data);
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    }
  }, []);

  // Enhanced Booking Management Functions
  const getBookingDetails = async (bookingId) => {
    try {
      return await adminApi.getBookingDetails(bookingId);
    } catch (error) {
      console.error('Failed to get booking details:', error);
      return { success: false, error: error.message };
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const result = await adminApi.updateBookingStatus(bookingId, status);
      if (result.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === bookingId ? { ...booking, status } : booking
          )
        );
      }
      return result;
    } catch (error) {
      console.error('Failed to update booking status:', error);
      return { success: false, error: error.message };
    }
  };

  const updatePaymentStatus = async (
    bookingId,
    paymentStatus,
    transactionId = ''
  ) => {
    try {
      const result = await adminApi.updatePaymentStatus(
        bookingId,
        paymentStatus,
        transactionId
      );
      if (result.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === bookingId
              ? {
                  ...booking,
                  payment: { ...booking.payment, status: paymentStatus },
                }
              : booking
          )
        );
      }
      return result;
    } catch (error) {
      console.error('Failed to update payment status:', error);
      return { success: false, error: error.message };
    }
  };

  const bulkUpdateBookingStatus = async (bookingIds, status) => {
    try {
      const result = await adminApi.bulkUpdateBookingStatus(bookingIds, status);
      if (result.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            bookingIds.includes(booking._id) ? { ...booking, status } : booking
          )
        );
      }
      return result;
    } catch (error) {
      console.error('Failed to bulk update booking status:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteBookingAdmin = async (bookingId) => {
    try {
      const result = await adminApi.deleteBooking(bookingId);
      if (result.success) {
        setBookings((prev) =>
          prev.filter((booking) => booking._id !== bookingId)
        );
      }
      return result;
    } catch (error) {
      console.error('Failed to delete booking:', error);
      return { success: false, error: error.message };
    }
  };

  const getBookingStats = async () => {
    try {
      return await adminApi.getBookingStats();
    } catch (error) {
      console.error('Failed to get booking stats:', error);
      return { success: false, error: error.message };
    }
  };

  const addBookingNote = async (bookingId, content) => {
    try {
      return await adminApi.addBookingNote(bookingId, content);
    } catch (error) {
      console.error('Failed to add booking note:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    // State
    properties,
    bookings,
    users,
    feedback,
    currentUser,
    adminProfile,
    loading,

    // Authentication
    login,
    logout,

    // Admin profile management
    fetchAdminProfile,
    updateAdminProfile,
    refreshAdminProfile,

    // Property management
    addProperty,
    updateProperty,
    deleteProperty,
    fetchProperties,

    // Booking management
    addBooking,
    updateBooking,
    deleteBooking,
    fetchBookings,
    getBookingDetails,
    updateBookingStatus,
    updatePaymentStatus,
    bulkUpdateBookingStatus,
    deleteBookingAdmin,
    getBookingStats,
    addBookingNote,

    // User management
    fetchUsers,
    getUserDetails,
    addUser,
    updateUser,
    updateUserStatus,
    deleteUser,

    // Feedback management
    respondToFeedback,
    fetchFeedback,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
