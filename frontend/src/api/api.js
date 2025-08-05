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

// Mock data for fallback (will be replaced by API calls)
export const USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'buyer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'seller' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'seller' },
];

export const PROPERTIES = [
  // Rooms
  {
    id: 1,
    title: 'Modern Single Room with Kitchen',
    description:
      'A beautifully designed single room with attached kitchen and sleeping area.',
    price: 8000,
    type: 'room',
    roomType: 'single-kitchen',
    location: 'Kathmandu',
    area: 200,
    imageUrl:
      'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
    sellerId: 2,
    status: 'available',
    views: { total: 156, loggedIn: 89, anonymous: 67 },
    featured: true,
  },
  {
    id: 2,
    title: 'Cozy Double Room',
    description:
      'Spacious double room with shared kitchen and bathroom facilities.',
    price: 12000,
    type: 'room',
    roomType: 'double',
    location: 'Patan',
    area: 250,
    imageUrl:
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    sellerId: 2,
    status: 'available',
    views: { total: 98, loggedIn: 45, anonymous: 53 },
    featured: false,
  },
  {
    id: 3,
    title: 'Luxury Studio Apartment',
    description: 'Fully furnished studio apartment with modern amenities.',
    price: 18000,
    type: 'room',
    roomType: 'studio',
    location: 'Boudha',
    area: 300,
    imageUrl:
      'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg',
    sellerId: 3,
    status: 'available',
    views: { total: 210, loggedIn: 120, anonymous: 90 },
    featured: true,
  },
  {
    id: 4,
    title: 'Budget Single Room',
    description: 'Simple and affordable single room with shared facilities.',
    price: 6000,
    type: 'room',
    roomType: 'single',
    location: 'Koteshwor',
    area: 150,
    imageUrl:
      'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg',
    sellerId: 3,
    status: 'available',
    views: { total: 87, loggedIn: 32, anonymous: 55 },
    featured: false,
  },

  // Flats
  {
    id: 5,
    title: 'Spacious 2BHK Flat',
    description: 'Modern 2BHK flat with all amenities in a prime location.',
    price: 25000,
    type: 'flat',
    flatType: '2bhk',
    location: 'Lalitpur',
    area: 800,
    imageUrl:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    sellerId: 2,
    status: 'available',
    views: { total: 234, loggedIn: 145, anonymous: 89 },
    featured: true,
  },
  {
    id: 6,
    title: 'Luxury 3BHK Apartment',
    description:
      'Premium apartment with modern amenities and stunning city views.',
    price: 35000,
    type: 'flat',
    flatType: '3bhk',
    location: 'Kathmandu',
    area: 1200,
    imageUrl:
      'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg',
    sellerId: 2,
    status: 'available',
    views: { total: 312, loggedIn: 198, anonymous: 114 },
    featured: true,
  },
  {
    id: 7,
    title: 'Compact 1BHK Flat',
    description: 'Affordable 1BHK flat perfect for singles or couples.',
    price: 18000,
    type: 'flat',
    flatType: '1bhk',
    location: 'Bhaktapur',
    area: 500,
    imageUrl:
      'https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg',
    sellerId: 3,
    status: 'available',
    views: { total: 145, loggedIn: 78, anonymous: 67 },
    featured: false,
  },
  {
    id: 8,
    title: 'Modern 2BHK Duplex',
    description: 'Stylish duplex apartment with two floors and balcony.',
    price: 30000,
    type: 'flat',
    flatType: '2bhk-duplex',
    location: 'Kathmandu',
    area: 950,
    imageUrl:
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    sellerId: 3,
    status: 'available',
    views: { total: 189, loggedIn: 112, anonymous: 77 },
    featured: true,
  },
  {
    id: 9,
    title: 'Affordable 1BHK for Students',
    description: 'Budget-friendly 1BHK near university area.',
    price: 15000,
    type: 'flat',
    flatType: '1bhk',
    location: 'Kirtipur',
    area: 450,
    imageUrl:
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
    sellerId: 2,
    status: 'available',
    views: { total: 132, loggedIn: 65, anonymous: 67 },
    featured: false,
  },
  {
    id: 10,
    title: 'Family 3BHK with Garden',
    description: 'Spacious family flat with small garden area.',
    price: 40000,
    type: 'flat',
    flatType: '3bhk',
    location: 'Dhapasi',
    area: 1400,
    imageUrl:
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    sellerId: 3,
    status: 'available',
    views: { total: 167, loggedIn: 98, anonymous: 69 },
    featured: true,
  },
];

const WISHLIST = [
  { userId: 1, propertyId: 1 },
  { userId: 1, propertyId: 3 },
  { userId: 1, propertyId: 6 },
];

const BOOKINGS = [
  {
    id: 1,
    userId: 1,
    propertyId: 2,
    numberOfPeople: 2,
    hasPets: false,
    useType: 'personal',
    message: 'Looking forward to moving in',
    paymentMethod: 'online',
    paymentStatus: 'pending',
    bookingStatus: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 1,
    propertyId: 5,
    numberOfPeople: 3,
    hasPets: true,
    useType: 'family',
    message: 'Need long term rental',
    paymentMethod: 'cash',
    paymentStatus: 'completed',
    bookingStatus: 'confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Helper function to simulate API delay (keeping for backward compatibility)
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      localStorage.setItem('user', JSON.stringify(data.data));
    }

    return { success: true, user: data.data, token: data.token };
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
      localStorage.setItem('user', JSON.stringify(data.data));
    }

    return { success: true, user: data.data, token: data.token };
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
    return PROPERTIES.filter((property) => property.featured); // Fallback to mock data
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

    console.log('Fetching from URL:', url); // Debug log

    const response = await fetch(url, {
      headers: createHeaders(false),
    });

    console.log('Response status:', response.status); // Debug log

    const data = await handleApiResponse(response);
    console.log('Raw API response:', data); // Debug log

    const result = {
      properties: data.data || data.properties || [],
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
      total: data.total || 0,
    };

    console.log('Processed result:', result); // Debug log
    return result;
  } catch (error) {
    console.error('Error fetching properties:', error);
    // Fallback to mock data with filtering
    let filteredProperties = [...PROPERTIES];

    if (filters.location) {
      filteredProperties = filteredProperties.filter((property) =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.type) {
      filteredProperties = filteredProperties.filter(
        (property) => property.type === filters.type
      );
    }

    if (filters.minPrice) {
      filteredProperties = filteredProperties.filter(
        (property) => property.price >= filters.minPrice
      );
    }

    if (filters.maxPrice) {
      filteredProperties = filteredProperties.filter(
        (property) => property.price <= filters.maxPrice
      );
    }

    return {
      properties: filteredProperties,
      totalPages: 1,
      currentPage: 1,
      total: filteredProperties.length,
    };
  }
};

export const getPropertyById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/properties/${id}`, {
      headers: createHeaders(false),
    });

    const data = await handleApiResponse(response);
    return { success: true, property: data.data };
  } catch (error) {
    console.error('Error fetching property:', error);
    // Fallback to mock data
    const property = PROPERTIES.find(
      (property) => property.id === parseInt(id)
    );

    if (property) {
      property.views.total += 1;
      property.views.anonymous += 1;
      return { success: true, property };
    }

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
    return { success: true, property: data.data };
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
    return { success: true, property: data.data };
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

// Booking API functions
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(bookingData),
    });

    const data = await handleApiResponse(response);
    return { success: true, booking: data.data };
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

export const processPayment = async (bookingId, paymentMethod) => {
  try {
    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/payment`,
      {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify({
          paymentMethod,
          transactionId:
            paymentMethod === 'online'
              ? `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              : undefined,
        }),
      }
    );

    const data = await handleApiResponse(response);
    return {
      success: true,
      message: 'Payment processed successfully',
      booking: data.data,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Wishlist API functions
export const getWishlistByUserId = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/wishlist`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return data.wishlist || [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    // Fallback to mock data
    const wishlistIds = WISHLIST.filter((item) => item.userId === userId).map(
      (item) => item.propertyId
    );

    const wishlistProperties = PROPERTIES.filter((property) =>
      wishlistIds.includes(property.id)
    );

    return wishlistProperties;
  }
};

export const addToWishlist = async (userId, propertyId) => {
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

export const removeFromWishlist = async (userId, propertyId) => {
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
    return { success: true, user: data.data.user };
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

export const getBookingsByUserId = async (userId) => {
  await delay(500);
  return BOOKINGS.filter((booking) => booking.userId === userId).map(
    (booking) => ({
      ...booking,
      property: PROPERTIES.find((p) => p.id === booking.propertyId),
    })
  );
};

export const getBookingsBySellerId = async (sellerId) => {
  await delay(500);
  const sellerProperties = PROPERTIES.filter((p) => p.sellerId === sellerId);
  return BOOKINGS.filter((booking) =>
    sellerProperties.some((p) => p.id === booking.propertyId)
  ).map((booking) => ({
    ...booking,
    property: PROPERTIES.find((p) => p.id === booking.propertyId),
    user: USERS.find((u) => u.id === booking.userId),
  }));
};

export const getBuyerDashboardStats = async (userId) => {
  await delay(500);

  const userBookings = BOOKINGS.filter((booking) => booking.userId === userId);
  const userWishlist = WISHLIST.filter((item) => item.userId === userId);

  return {
    totalBookings: userBookings.length,
    activeBookings: userBookings.filter((b) => b.bookingStatus === 'confirmed')
      .length,
    pendingBookings: userBookings.filter((b) => b.bookingStatus === 'pending')
      .length,
    wishlistCount: userWishlist.length,
    recentBookings: userBookings.slice(-3).map((booking) => ({
      ...booking,
      property: PROPERTIES.find((p) => p.id === booking.propertyId),
    })),
  };
};

export const getSellerDashboardStats = async (sellerId) => {
  await delay(500);

  const sellerProperties = PROPERTIES.filter((p) => p.sellerId === sellerId);
  const propertyIds = sellerProperties.map((p) => p.id);
  const propertyBookings = BOOKINGS.filter((b) =>
    propertyIds.includes(b.propertyId)
  );

  const totalViews = sellerProperties.reduce(
    (sum, p) => sum + p.views.total,
    0
  );
  const totalEarnings = propertyBookings
    .filter((b) => b.paymentStatus === 'completed')
    .reduce((sum, b) => {
      const property = PROPERTIES.find((p) => p.id === b.propertyId);
      return sum + property.price;
    }, 0);

  return {
    totalProperties: sellerProperties.length,
    activeListings: sellerProperties.filter((p) => p.status === 'available')
      .length,
    totalBookings: propertyBookings.length,
    pendingBookings: propertyBookings.filter(
      (b) => b.bookingStatus === 'pending'
    ).length,
    totalViews,
    totalEarnings,
    recentBookings: propertyBookings.slice(-3).map((booking) => ({
      ...booking,
      property: PROPERTIES.find((p) => p.id === booking.propertyId),
      user: USERS.find((u) => u.id === booking.userId),
    })),
  };
};

export const addProperty = async (propertyData) => {
  try {
    const response = await fetch(`${API_URL}/api/properties`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(propertyData),
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('Error adding property:', error);
    // Fallback to mock data for development
    await delay(800);

    const newProperty = {
      id: PROPERTIES.length + 1,
      ...propertyData,
      views: {
        total: 0,
        loggedIn: 0,
        anonymous: 0,
      },
      status: 'pending',
      featured: false,
    };

    PROPERTIES.push(newProperty);
    return { success: true, data: newProperty };
  }
};

export const getPropertiesBySellerId = async (sellerId) => {
  await delay(500);
  return PROPERTIES.filter((property) => property.sellerId === sellerId);
};

// Get my properties (for authenticated sellers)
export const getMyProperties = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await fetch(
      `${API_URL}/api/properties/my/properties${
        queryParams.toString() ? '?' + queryParams.toString() : ''
      }`,
      {
        method: 'GET',
        headers: createHeaders(true),
      }
    );

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('Error fetching my properties:', error);
    // Fallback to mock data for development
    await delay(500);
    const mockProperties = PROPERTIES.filter(
      (property) => property.sellerId === 2
    );
    return {
      success: true,
      data: mockProperties,
      count: mockProperties.length,
      total: mockProperties.length,
    };
  }
};

// Image Upload Functions
export const uploadSingleImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/images/upload-single`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    const data = await handleApiResponse(response);
    return { success: true, imageUrl: data.data.url };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const uploadMultipleImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_URL}/api/images/upload-multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    const data = await handleApiResponse(response);
    return {
      success: true,
      imageUrls: data.data.uploaded.map((img) => img.url),
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Search Properties API
export const searchProperties = async (searchParams) => {
  try {
    const queryParams = new URLSearchParams();

    // Handle search query - could be from location, type, or general search
    let searchQuery = '';
    if (searchParams.location) {
      searchQuery = searchParams.location;
    } else if (searchParams.type) {
      searchQuery = searchParams.type;
    } else if (searchParams.q) {
      searchQuery = searchParams.q;
    }

    if (searchQuery) queryParams.append('q', searchQuery);
    if (searchParams.minPrice)
      queryParams.append('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice)
      queryParams.append('maxPrice', searchParams.maxPrice);
    if (searchParams.page) queryParams.append('page', searchParams.page);
    if (searchParams.limit) queryParams.append('limit', searchParams.limit);

    const url = `${API_URL}/api/properties/search${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await fetch(url, {
      headers: createHeaders(false),
    });

    const data = await handleApiResponse(response);
    return {
      properties: data.properties || data.data || [],
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
      total: data.total || 0,
    };
  } catch (error) {
    console.error('Error searching properties:', error);
    // Fallback to regular getAllProperties if search fails
    return getAllProperties(searchParams);
  }
};
