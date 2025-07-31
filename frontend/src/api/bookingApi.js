// Booking API Integration
import { API_URL } from '../config.js';

// API Helper Functions
const getAuthToken = () => {
  return localStorage.getItem('token');
};

const createHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
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

// Mock data for fallback
const BOOKINGS = [
  {
    id: 1,
    propertyId: 1,
    buyerId: 1,
    sellerId: 2,
    status: 'pending',
    totalAmount: 25000,
    commission: 1250, // 5% of total
    createdAt: '2024-02-15',
    property: {
      title: 'Modern Apartment in City Center',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    },
    buyer: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    seller: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  },
  {
    id: 2,
    propertyId: 3,
    buyerId: 1,
    sellerId: 2,
    status: 'approved',
    totalAmount: 120000,
    commission: 6000,
    createdAt: '2024-02-10',
    property: {
      title: 'Luxury Villa with Pool',
      imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227',
    },
    buyer: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    seller: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  },
];

// Helper function to simulate API delay (keeping for backward compatibility)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Get bookings by buyer ID
export const getBookingsByBuyerId = async (buyerId) => {
  try {
    const response = await fetch(`${API_URL}/api/bookings/user`, {
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    return data.bookings || [];
  } catch (error) {
    console.error('Error fetching buyer bookings:', error);
    // Fallback to mock data
    return BOOKINGS.filter((booking) => booking.buyerId === buyerId);
  }
};

// Get bookings by seller ID
export const getBookingsBySellerId = async (sellerId) => {
  try {
    const response = await fetch(`${API_URL}/api/bookings/seller`, {
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    return data.bookings || [];
  } catch (error) {
    console.error('Error fetching seller bookings:', error);
    // Fallback to mock data
    return BOOKINGS.filter((booking) => booking.sellerId === sellerId);
  }
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(bookingData),
    });

    const data = await handleApiResponse(response);
    return { success: true, booking: data.booking };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, message: error.message };
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/status`,
      {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify({ status }),
      }
    );

    const data = await handleApiResponse(response);
    return { success: true, booking: data.booking };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, message: error.message };
  }
};

// Get all bookings (admin only)
export const getAllBookings = async () => {
  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    return data.bookings || [];
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return BOOKINGS; // Fallback to mock data
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    return { success: true, booking: data.booking };
  } catch (error) {
    console.error('Error fetching booking:', error);
    // Fallback to mock data
    const booking = BOOKINGS.find((b) => b.id === parseInt(bookingId));
    if (booking) {
      return { success: true, booking };
    }
    return { success: false, message: 'Booking not found' };
  }
};

// Process payment for booking
export const processPayment = async (bookingId, paymentData) => {
  try {
    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/payment`,
      {
        method: 'POST',
        headers: createHeaders(),
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
    console.error('Error processing payment:', error);
    return { success: false, message: error.message };
  }
};

// Get seller earnings summary
export const getSellerEarningsSummary = async (sellerId) => {
  await delay(600);

  const sellerBookings = BOOKINGS.filter(
    (booking) => booking.sellerId === sellerId && booking.status === 'approved'
  );

  const totalEarnings = sellerBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );

  const totalCommission = sellerBookings.reduce(
    (sum, booking) => sum + booking.commission,
    0
  );

  return {
    totalEarnings,
    totalCommission,
    netEarnings: totalEarnings - totalCommission,
    totalBookings: sellerBookings.length,
  };
};
