// API Configuration and Utilities
import { API_URL } from '../config.js';

// API Helper Functions
const getAuthToken = () => {
  return localStorage.getItem('token');
};

const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleApiResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

// Authentication API functions
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    const data = await handleApiResponse(response);

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify(userData),
    });

    const data = await handleApiResponse(response);

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const logoutUser = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { success: true };
};

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify({ email }),
    });

    const data = await handleApiResponse(response);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await fetch(
      `${API_URL}/api/auth/reset-password/${token}`,
      {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify({ password }),
      }
    );

    const data = await handleApiResponse(response);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Property API functions
export const getFeaturedProperties = async () => {
  try {
    const response = await fetch(`${API_URL}/api/properties/featured`, {
      headers: createHeaders(false),
    });

    const data = await handleApiResponse(response);
    return data.properties || [];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
};

export const getAllProperties = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters.location) queryParams.append('location', filters.location);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const url = `${API_URL}/api/properties${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await fetch(url, {
      headers: createHeaders(false),
    });

    const data = await handleApiResponse(response);
    return {
      properties: data.properties || [],
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
      total: data.total || 0,
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return {
      properties: [],
      totalPages: 1,
      currentPage: 1,
      total: 0,
    };
  }
};

export const getPropertyById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/properties/${id}`, {
      headers: createHeaders(false),
    });

    const data = await handleApiResponse(response);
    return { success: true, property: data.property };
  } catch (error) {
    console.error('Error fetching property:', error);
    return { success: false, message: 'Property not found' };
  }
};

export const createProperty = async (propertyData) => {
  try {
    const response = await fetch(`${API_URL}/api/properties`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(propertyData),
    });

    const data = await handleApiResponse(response);
    return { success: true, property: data.property };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    const response = await fetch(`${API_URL}/api/properties/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(propertyData),
    });

    const data = await handleApiResponse(response);
    return { success: true, property: data.property };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteProperty = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/properties/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });

    await handleApiResponse(response);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getMyProperties = async () => {
  try {
    const response = await fetch(`${API_URL}/api/properties/my-properties`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return { success: true, properties: data.properties };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Booking API functions
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(bookingData),
    });

    const data = await handleApiResponse(response);
    return { success: true, booking: data.booking };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getUserBookings = async () => {
  try {
    const response = await fetch(`${API_URL}/api/bookings/user`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return { success: true, bookings: data.bookings };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getBookingById = async (bookingId) => {
  try {
    const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return { success: true, booking: data.booking };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/status`,
      {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify({ status }),
      }
    );

    const data = await handleApiResponse(response);
    return { success: true, booking: data.booking };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const processPayment = async (bookingId, paymentData) => {
  try {
    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/payment`,
      {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(paymentData),
      }
    );

    const data = await handleApiResponse(response);
    return {
      success: true,
      message: 'Payment processed successfully',
      booking: data.booking,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Wishlist API functions
export const getWishlistByUserId = async () => {
  try {
    const response = await fetch(`${API_URL}/api/wishlist`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return data.wishlist || [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
};

export const addToWishlist = async (propertyId) => {
  try {
    const response = await fetch(`${API_URL}/api/wishlist`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({ propertyId }),
    });

    const data = await handleApiResponse(response);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const removeFromWishlist = async (propertyId) => {
  try {
    const response = await fetch(`${API_URL}/api/wishlist/${propertyId}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// User API functions
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(profileData),
    });

    const data = await handleApiResponse(response);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/users`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return { success: true, users: data.users };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}/status`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify({ status }),
    });

    const data = await handleApiResponse(response);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Feedback API functions
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await fetch(`${API_URL}/api/feedback`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(feedbackData),
    });

    const data = await handleApiResponse(response);
    return { success: true, feedback: data.feedback };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getFeedback = async () => {
  try {
    const response = await fetch(`${API_URL}/api/feedback`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return { success: true, feedback: data.feedback };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const respondToFeedback = async (feedbackId, response) => {
  try {
    const apiResponse = await fetch(
      `${API_URL}/api/feedback/${feedbackId}/respond`,
      {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify({ response }),
      }
    );

    const data = await handleApiResponse(apiResponse);
    return { success: true, feedback: data.feedback };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Admin API functions
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_URL}/api/admin/stats`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return { success: true, stats: data.stats };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAllBookings = async () => {
  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return { success: true, bookings: data.bookings };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Utility functions
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const uploadFile = async (file, folder = 'properties') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    const data = await handleApiResponse(response);
    return { success: true, url: data.url };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Search and Filter utilities
export const searchProperties = async (searchTerm, filters = {}) => {
  const searchFilters = {
    ...filters,
    search: searchTerm,
  };

  return await getAllProperties(searchFilters);
};

export const getRecommendations = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/properties/recommendations`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return { success: true, properties: data.properties };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
