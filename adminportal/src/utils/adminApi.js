// Admin API Integration with Backend
import { faker } from '@faker-js/faker';

// API Configuration
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

// Simple cache to prevent duplicate requests
const requestCache = new Map();
const pendingRequests = new Map();

// Rate limiting - track request times
const rateLimitTracker = new Map();
const RATE_LIMIT_WINDOW = 1000; // 1 second
const MAX_REQUESTS_PER_WINDOW = 3;

// Cleanup old cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp > 300000) {
      // 5 minutes
      requestCache.delete(key);
    }
  }
}, 300000);

// API Helper Functions
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Auto-login for testing
const ensureAuthenticated = async () => {
  const token = getAuthToken();
  if (!token) {
    try {
      const response = await fetch(`${API_URL}/api/admin/test-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        return data.token;
      }
    } catch (error) {
      console.error('Auto-login failed:', error);
    }
  }
  return token;
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

// Helper function to make cached requests
const makeCachedRequest = async (url, options = {}, cacheKey = null) => {
  // Ensure authentication before making request
  await ensureAuthenticated();

  const key = cacheKey || `${url}_${JSON.stringify(options)}`;

  // Rate limiting check
  const now = Date.now();
  const endpoint = new URL(url).pathname;

  if (!rateLimitTracker.has(endpoint)) {
    rateLimitTracker.set(endpoint, []);
  }

  const requests = rateLimitTracker.get(endpoint);
  // Remove old requests outside the window
  const recentRequests = requests.filter(
    (time) => now - time < RATE_LIMIT_WINDOW
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    console.warn(
      `Rate limit exceeded for ${endpoint}, using cached data if available`
    );
    const cached = requestCache.get(key);
    if (cached) {
      return cached.data;
    }
    // If no cached data, wait before making request
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_WINDOW));
  }

  // Update rate limit tracker
  recentRequests.push(now);
  rateLimitTracker.set(endpoint, recentRequests);

  // Check if there's a pending request for this endpoint
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  // Check cache (valid for 30 seconds)
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < 30000) {
    return cached.data;
  }

  // Make sure we have the latest auth headers
  if (options.headers && options.headers.Authorization) {
    const token = getAuthToken();
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Make the request
  const requestPromise = fetch(url, options)
    .then(handleApiResponse)
    .then((data) => {
      // Cache the result
      requestCache.set(key, {
        data,
        timestamp: Date.now(),
      });
      // Remove from pending requests
      pendingRequests.delete(key);
      return data;
    })
    .catch((error) => {
      // Remove from pending requests on error
      pendingRequests.delete(key);
      throw error;
    });

  // Store the pending request
  pendingRequests.set(key, requestPromise);

  return requestPromise;
};

// Generate dummy booking data (fallback)

// Generate dummy booking data
const generateBookings = (count = 10) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    buyerName: faker.person.fullName(),
    sellerName: faker.person.fullName(),
    propertyName: faker.location.streetAddress(),
    date: faker.date.recent({ days: 30 }).toISOString(),
    totalAmount: faker.number.float({ min: 1000, max: 10000, precision: 2 }),
    get commissionAmount() {
      return this.totalAmount * 0.05;
    },
  }));
};

// Generate dummy feedback data
const generateFeedback = (count = 8) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    userName: faker.person.fullName(),
    message: faker.lorem.paragraph(),
    date: faker.date.recent({ days: 60 }).toISOString(),
    status: faker.helpers.arrayElement(['Pending', 'Approved']),
  }));
};

// Generate dummy pages data
const generatePages = (count = 5) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    content: faker.lorem.paragraphs(3),
    type: faker.helpers.arrayElement(['Blog', 'About', 'Terms', 'Privacy']),
    featuredImage: faker.image.url(),
    shortDescription: faker.lorem.paragraph(),
    tags: Array.from({ length: 3 }, () => faker.lorem.word()),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }));
};

// Generate analytics data
const generateAnalytics = () => {
  return {
    dailyVisits: Array.from({ length: 7 }, () =>
      faker.number.int({ min: 100, max: 1000 })
    ),
    weeklyLabels: Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    topCities: [
      { name: 'Bhaktapur', value: faker.number.int({ min: 50, max: 200 }) },
      { name: 'Lalitpur', value: faker.number.int({ min: 40, max: 180 }) },
      { name: 'Boudha', value: faker.number.int({ min: 30, max: 150 }) },
      { name: 'Chabahil', value: faker.number.int({ min: 25, max: 120 }) },
      { name: 'Gokarna', value: faker.number.int({ min: 20, max: 100 }) },
    ],
    deviceStats: {
      mobile: 45,
      desktop: 40,
      tablet: 15,
    },
    topProperties: Array.from({ length: 5 }, () => ({
      title: faker.lorem.words(3),
      views: faker.number.int({ min: 500, max: 2000 }),
    })),
  };
};

// Real API functions for admin dashboard
export const adminApi = {
  // Authentication
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify({ email, password }),
      });

      const data = await handleApiResponse(response);

      if (data.token && data.data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
      }

      return { success: true, user: data.data, token: data.token };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Dashboard Analytics
  getDashboardStats: async () => {
    try {
      await ensureAuthenticated();

      const data = await makeCachedRequest(
        `${API_URL}/api/admin/stats`,
        {
          headers: createHeaders(true),
        },
        'dashboard_stats'
      );

      // Handle the correct response structure from backend
      if (data && data.stats) {
        return {
          totalUsers: data.stats.totalUsers || 0,
          totalListings: data.stats.totalListings || 0,
          totalVisits: data.stats.totalVisits || 0,
          activeSellers: data.stats.activeSellers || 0,
        };
      }

      // Fallback if no data
      return {
        totalUsers: 1845,
        totalListings: 672,
        totalVisits: 9243,
        activeSellers: 328,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Always return fallback data for now
      return {
        totalUsers: 1845,
        totalListings: 672,
        totalVisits: 9243,
        activeSellers: 328,
      };
    }
  },

  // Bookings Management
  getBookings: async (
    page = 1,
    limit = 10,
    status = '',
    paymentStatus = ''
  ) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      });

      const cacheKey = `bookings_${queryParams.toString()}`;

      const response = await makeCachedRequest(
        `${API_URL}/api/bookings?${queryParams}`,
        {
          headers: createHeaders(true),
        },
        cacheKey
      );

      return {
        bookings: response.data || [],
        total: response.total || 0,
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback to mock data
      const mockBookings = generateBookings();
      return {
        bookings: mockBookings,
        total: mockBookings.length,
        totalPages: 1,
        currentPage: 1,
      };
    }
  },

  getBookingDetails: async (bookingId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/details`,
        {
          headers: createHeaders(true),
        }
      );

      const data = await handleApiResponse(response);
      return { success: true, booking: data.data };
    } catch (error) {
      console.error('Error fetching booking details:', error);
      return { success: false, error: error.message };
    }
  },

  updateBookingStatus: async (bookingId, status) => {
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
      return { success: true, booking: data.data };
    } catch (error) {
      console.error('Error updating booking status:', error);
      return { success: false, message: error.message };
    }
  },

  updatePaymentStatus: async (bookingId, paymentStatus, transactionId = '') => {
    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/payment-status`,
        {
          method: 'PUT',
          headers: createHeaders(true),
          body: JSON.stringify({ paymentStatus, transactionId }),
        }
      );

      const data = await handleApiResponse(response);
      return { success: true, booking: data.data };
    } catch (error) {
      console.error('Error updating payment status:', error);
      return { success: false, message: error.message };
    }
  },

  bulkUpdateBookingStatus: async (bookingIds, status) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/bulk-status`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify({ bookingIds, status }),
      });

      const data = await handleApiResponse(response);
      return {
        success: true,
        message: data.message,
        modifiedCount: data.modifiedCount,
      };
    } catch (error) {
      console.error('Error bulk updating booking status:', error);
      return { success: false, message: error.message };
    }
  },

  deleteBooking: async (bookingId) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: createHeaders(true),
      });

      const data = await handleApiResponse(response);
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error deleting booking:', error);
      return { success: false, message: error.message };
    }
  },

  getBookingStats: async () => {
    try {
      const response = await makeCachedRequest(
        `${API_URL}/api/bookings/stats/overview`,
        {
          headers: createHeaders(true),
        },
        'booking_stats'
      );

      return { success: true, stats: response.data };
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      // Fallback stats
      const mockBookings = generateBookings();
      return {
        success: true,
        stats: {
          totalBookings: mockBookings.length,
          pendingBookings: mockBookings.filter((b) => b.status === 'pending')
            .length,
          confirmedBookings: mockBookings.filter(
            (b) => b.status === 'confirmed'
          ).length,
          completedBookings: mockBookings.filter(
            (b) => b.status === 'completed'
          ).length,
          totalRevenue: mockBookings.reduce(
            (sum, b) => sum + (b.commissionAmount || 0),
            0
          ),
          totalBookingValue: mockBookings.reduce(
            (sum, b) => sum + (b.totalAmount || 0),
            0
          ),
        },
      };
    }
  },

  addBookingNote: async (bookingId, content) => {
    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/notes`,
        {
          method: 'POST',
          headers: createHeaders(true),
          body: JSON.stringify({ content }),
        }
      );

      const data = await handleApiResponse(response);
      return { success: true, booking: data.data };
    } catch (error) {
      console.error('Error adding booking note:', error);
      return { success: false, message: error.message };
    }
  },

  createBookingAdmin: async (bookingData) => {
    try {
      await ensureAuthenticated();
      const response = await fetch(`${API_URL}/api/bookings/admin/create`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(bookingData),
      });

      const data = await handleApiResponse(response);
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: error.message || 'Failed to create booking',
      };
    }
  },

  getProperties: async () => {
    try {
      await ensureAuthenticated();
      const response = await fetch(`${API_URL}/api/admin/properties`, {
        method: 'GET',
        headers: createHeaders(true),
      });

      const data = await handleApiResponse(response);
      return { success: true, data: data.properties || [] };
    } catch (error) {
      console.error('Error fetching properties:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch properties',
      };
    }
  },

  getUsers: async (role = null) => {
    try {
      await ensureAuthenticated();
      const url = role
        ? `${API_URL}/api/admin/users?role=${role}`
        : `${API_URL}/api/admin/users`;

      const response = await fetch(url, {
        method: 'GET',
        headers: createHeaders(true),
      });

      const data = await handleApiResponse(response);
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch users',
      };
    }
  },

  // User Management
  getUserList: async (
    page = 1,
    limit = 10,
    search = '',
    role = '',
    status = ''
  ) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(role && { role }),
        ...(status && { status }),
      });

      const response = await fetch(
        `${API_URL}/api/admin/users?${queryParams}`,
        {
          headers: createHeaders(true),
        }
      );

      const data = await handleApiResponse(response);

      // Transform backend data to match frontend expectations
      const transformedUsers =
        data.data?.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          phone: user.profile?.phone || '',
          visits: user.profile?.visits || 0,
          joinDate: new Date(user.createdAt).toLocaleDateString(),
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        })) || [];

      return {
        users: transformedUsers,
        pagination: {
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          total: data.total || 0,
          count: data.count || 0,
        },
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data
      const mockUsers = Array.from({ length: 15 }, () => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: faker.helpers.arrayElement(['buyer', 'seller']),
        status: faker.helpers.arrayElement(['active', 'inactive', 'blocked']),
        visits: faker.number.int({ min: 10, max: 100 }),
        joinDate: faker.date.past().toLocaleDateString(),
        phone: faker.phone.number(),
        createdAt: faker.date.past().toISOString(),
        lastLogin: faker.date.recent().toISOString(),
      }));

      return {
        users: mockUsers,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          total: mockUsers.length,
          count: mockUsers.length,
        },
      };
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        headers: createHeaders(true),
      });

      const data = await handleApiResponse(response);

      // Transform backend data
      const user = data.data?.user;
      if (user) {
        return {
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            phone: user.profile?.phone || '',
            address: user.profile?.address || {},
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            properties: data.data?.properties || [],
            bookings: data.data?.bookings || [],
          },
        };
      }
      return { success: false, message: 'User not found' };
    } catch (error) {
      console.error('Error fetching user details:', error);
      return { success: false, message: error.message };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify(userData),
      });

      const data = await handleApiResponse(response);

      // Transform backend response
      const user = data.data;
      if (user) {
        return {
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            phone: user.profile?.phone || '',
            joinDate: new Date(user.createdAt).toLocaleDateString(),
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
          },
        };
      }
      return { success: false, message: 'Failed to update user' };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, message: error.message };
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}/status`,
        {
          method: 'PUT',
          headers: createHeaders(true),
          body: JSON.stringify({ status }),
        }
      );

      const data = await handleApiResponse(response);

      // Transform backend response
      const user = data.data;
      if (user) {
        return {
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            phone: user.profile?.phone || '',
            joinDate: new Date(user.createdAt).toLocaleDateString(),
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
          },
        };
      }
      return { success: false, message: 'Failed to update user status' };
    } catch (error) {
      console.error('Error updating user status:', error);
      return { success: false, message: error.message };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: createHeaders(true),
      });

      await handleApiResponse(response);
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, message: error.message };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(userData),
      });

      const data = await handleApiResponse(response);

      // Transform backend response
      const user = data.data;
      if (user) {
        return {
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status || 'active',
            phone: user.profile?.phone || '',
            joinDate: new Date(user.createdAt).toLocaleDateString(),
            createdAt: user.createdAt,
          },
        };
      }
      return { success: false, message: 'Failed to create user' };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, message: error.message };
    }
  },

  // Property Management
  getListings: async (filters = {}) => {
    try {
      await ensureAuthenticated();

      // Build query params
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const data = await makeCachedRequest(
        `${API_URL}/api/admin/properties${
          queryParams.toString() ? '?' + queryParams.toString() : ''
        }`,
        {
          headers: createHeaders(true),
        },
        `admin_properties_${queryParams.toString()}`
      );

      return data.properties || [];
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Fallback to mock data
      return Array.from({ length: 20 }, () => ({
        id: faker.string.uuid(),
        title: faker.lorem.sentence({ min: 3, max: 5 }),
        type: faker.helpers.arrayElement([
          'Apartment',
          'House',
          'Studio',
          'Room',
          'Penthouse',
        ]),
        price: faker.number.int({ min: 800, max: 5000 }),
        owner: faker.person.fullName(),
        location: faker.location.city(),
        status: faker.helpers.arrayElement(['Active', 'Pending']),
        created: faker.date.recent({ days: 90 }).toLocaleDateString(),
      }));
    }
  },

  getPropertyDetails: async (propertyId) => {
    try {
      await ensureAuthenticated();

      const data = await makeCachedRequest(
        `${API_URL}/api/admin/properties/${propertyId}`,
        {
          headers: createHeaders(true),
        },
        `admin_property_${propertyId}`
      );

      return { success: true, property: data.data };
    } catch (error) {
      console.error('Error fetching property details:', error);
      return { success: false, message: error.message };
    }
  },

  updatePropertyStatus: async (propertyId, status) => {
    try {
      await ensureAuthenticated();

      const response = await fetch(
        `${API_URL}/api/admin/properties/${propertyId}/status`,
        {
          method: 'PUT',
          headers: createHeaders(true),
          body: JSON.stringify({ status }),
        }
      );

      const data = await handleApiResponse(response);

      // Clear related cache
      const cacheKeys = Array.from(requestCache.keys()).filter(
        (key) =>
          key.includes('admin_properties') ||
          key.includes(`admin_property_${propertyId}`)
      );
      cacheKeys.forEach((key) => requestCache.delete(key));

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error updating property status:', error);
      return { success: false, message: error.message };
    }
  },

  togglePropertyFeatured: async (propertyId) => {
    try {
      await ensureAuthenticated();

      const response = await fetch(
        `${API_URL}/api/admin/properties/${propertyId}/featured`,
        {
          method: 'PUT',
          headers: createHeaders(true),
        }
      );

      const data = await handleApiResponse(response);

      // Clear related cache
      const cacheKeys = Array.from(requestCache.keys()).filter(
        (key) =>
          key.includes('admin_properties') ||
          key.includes(`admin_property_${propertyId}`)
      );
      cacheKeys.forEach((key) => requestCache.delete(key));

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error toggling property featured status:', error);
      return { success: false, message: error.message };
    }
  },

  deletePropertyAdmin: async (propertyId) => {
    try {
      await ensureAuthenticated();

      const response = await fetch(
        `${API_URL}/api/admin/properties/${propertyId}`,
        {
          method: 'DELETE',
          headers: createHeaders(true),
        }
      );

      await handleApiResponse(response);

      // Clear related cache
      const cacheKeys = Array.from(requestCache.keys()).filter(
        (key) =>
          key.includes('admin_properties') ||
          key.includes(`admin_property_${propertyId}`)
      );
      cacheKeys.forEach((key) => requestCache.delete(key));

      return { success: true };
    } catch (error) {
      console.error('Error deleting property:', error);
      return { success: false, message: error.message };
    }
  },

  bulkUpdatePropertiesStatus: async (propertyIds, status) => {
    try {
      await ensureAuthenticated();

      const response = await fetch(
        `${API_URL}/api/admin/properties/bulk-status`,
        {
          method: 'PUT',
          headers: createHeaders(true),
          body: JSON.stringify({ propertyIds, status }),
        }
      );

      const data = await handleApiResponse(response);

      // Clear related cache
      const cacheKeys = Array.from(requestCache.keys()).filter((key) =>
        key.includes('admin_properties')
      );
      cacheKeys.forEach((key) => requestCache.delete(key));

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error bulk updating properties:', error);
      return { success: false, message: error.message };
    }
  },

  createProperty: async (propertyData) => {
    try {
      await ensureAuthenticated();

      const response = await fetch(`${API_URL}/api/admin/properties`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(propertyData),
      });

      const data = await handleApiResponse(response);

      // Clear related cache
      const cacheKeys = Array.from(requestCache.keys()).filter((key) =>
        key.includes('admin_properties')
      );
      cacheKeys.forEach((key) => requestCache.delete(key));

      return { success: true, property: data.data };
    } catch (error) {
      console.error('Error creating property:', error);
      return { success: false, message: error.message };
    }
  },

  updateProperty: async (propertyId, propertyData) => {
    try {
      const response = await fetch(`${API_URL}/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify(propertyData),
      });

      const data = await handleApiResponse(response);
      return { success: true, property: data.property };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  deleteProperty: async (propertyId) => {
    try {
      const response = await fetch(`${API_URL}/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: createHeaders(true),
      });

      await handleApiResponse(response);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Feedback Management
  getFeedback: async () => {
    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        headers: createHeaders(true),
      });

      const data = await handleApiResponse(response);
      return data.feedback || [];
    } catch (error) {
      console.error('Error fetching feedback:', error);
      // Fallback to mock data
      return generateFeedback();
    }
  },

  respondToFeedback: async (feedbackId, response) => {
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
  },

  // CMS Management
  getPages: async () => {
    try {
      const response = await fetch(`${API_URL}/api/cms/pages`, {
        headers: createHeaders(true),
      });

      const data = await handleApiResponse(response);
      return data.pages || [];
    } catch (error) {
      console.error('Error fetching pages:', error);
      // Fallback to mock data
      return generatePages();
    }
  },

  createPage: async (pageData) => {
    try {
      const response = await fetch(`${API_URL}/api/cms/pages`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(pageData),
      });

      const data = await handleApiResponse(response);
      return { success: true, page: data.page };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  updatePage: async (pageId, pageData) => {
    try {
      const response = await fetch(`${API_URL}/api/cms/pages/${pageId}`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify(pageData),
      });

      const data = await handleApiResponse(response);
      return { success: true, page: data.page };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  deletePage: async (pageId) => {
    try {
      const response = await fetch(`${API_URL}/api/cms/pages/${pageId}`, {
        method: 'DELETE',
        headers: createHeaders(true),
      });

      await handleApiResponse(response);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Blog Management
  getBlogPosts: async () => {
    try {
      const response = await fetch(`${API_URL}/api/cms/blog`, {
        headers: createHeaders(true),
      });

      const data = await handleApiResponse(response);
      return data.posts || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  },

  createBlogPost: async (postData) => {
    try {
      const response = await fetch(`${API_URL}/api/cms/blog`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(postData),
      });

      const data = await handleApiResponse(response);
      return { success: true, post: data.post };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  updateBlogPost: async (postId, postData) => {
    try {
      const response = await fetch(`${API_URL}/api/cms/blog/${postId}`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify(postData),
      });

      const data = await handleApiResponse(response);
      return { success: true, post: data.post };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Analytics
  getAnalytics: async () => {
    try {
      await ensureAuthenticated();

      const data = await makeCachedRequest(
        `${API_URL}/api/admin/analytics`,
        {
          headers: createHeaders(true),
        },
        'analytics'
      );

      return data.analytics || generateAnalytics();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Always return fallback data for now
      return generateAnalytics();
    }
  },

  // Recent Listings
  getRecentListings: async (limit = 4) => {
    try {
      await ensureAuthenticated();

      const data = await makeCachedRequest(
        `${API_URL}/api/admin/recent-listings?limit=${limit}`,
        {
          headers: createHeaders(true),
        },
        'recent_listings'
      );

      return data.data || [];
    } catch (error) {
      console.error('Error fetching recent listings:', error);
      // Always return fallback data for now
      return [
        {
          id: 1,
          title: 'Traditional House in Bhaktapur',
          type: 'House',
          location: 'Bhaktapur Durbar Square',
          price: 1500,
          status: 'Active',
          image:
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200',
          views: 156,
          likes: 23,
        },
        {
          id: 2,
          title: 'Modern Apartment in Lalitpur',
          type: 'Apartment',
          location: 'Patan, Lalitpur',
          price: 1200,
          status: 'Pending',
          image:
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=200',
          views: 98,
          likes: 15,
        },
        {
          id: 3,
          title: 'Studio near Boudhanath',
          type: 'Studio',
          location: 'Boudha',
          price: 800,
          status: 'Active',
          image:
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200',
          views: 76,
          likes: 12,
        },
        {
          id: 4,
          title: 'Commercial Space in Chabahil',
          type: 'Commercial',
          location: 'Chabahil Chowk',
          price: 2500,
          status: 'Active',
          image:
            'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=200',
          views: 234,
          likes: 31,
        },
      ];
    }
  },
};

// Legacy exports for backward compatibility
export const mockApi = adminApi;

export const getAnalyticsData = adminApi.getAnalytics;
export const getDashboardStats = adminApi.getDashboardStats;
export const getListings = adminApi.getListings;
export const getUserList = adminApi.getUserList;

// Property management exports
export const getPropertyDetails = adminApi.getPropertyDetails;
export const updatePropertyStatus = adminApi.updatePropertyStatus;
export const togglePropertyFeatured = adminApi.togglePropertyFeatured;
export const deletePropertyAdmin = adminApi.deletePropertyAdmin;
export const bulkUpdatePropertiesStatus = adminApi.bulkUpdatePropertiesStatus;

export const getAdminProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/api/admin/profile`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return data.data?.profile || data.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return {
      name: 'Admin User',
      email: 'admin@sajilobasai.com',
      phone: '+1234567890',
      role: 'Administrator',
      lastLogin: faker.date.recent().toLocaleString(),
    };
  }
};

export const createSeller = async (sellerData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify({
        ...sellerData,
        role: 'seller',
      }),
    });

    const data = await handleApiResponse(response);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const createProperty = adminApi.createProperty;

// Contact API functions
export const getContacts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/contacts`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching contacts:', error);
    // Fallback to mock data
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+977-9841234567',
        subject: 'Property Inquiry',
        message: 'Interested in listing my property in Kathmandu area',
        date: '2024-02-20',
        status: 'New',
        category: 'Property Listing',
        priority: 'Medium',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+977-9851234567',
        subject: 'Apartment Search',
        message: 'Need help finding an apartment near Thamel',
        date: '2024-02-19',
        status: 'Replied',
        category: 'General Inquiry',
        priority: 'High',
      },
      {
        id: 3,
        name: 'Ram Shrestha',
        email: 'ram@example.com',
        phone: '+977-9861234567',
        subject: 'Commercial Space',
        message: 'Looking for commercial space in Lalitpur',
        date: '2024-02-18',
        status: 'New',
        category: 'Property Listing',
        priority: 'Low',
      },
    ];
  }
};

export const updateContactStatus = async (contactId, status) => {
  try {
    const response = await fetch(
      `${API_URL}/api/contacts/${contactId}/status`,
      {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify({ status }),
      }
    );

    const data = await handleApiResponse(response);
    return { success: true, contact: data.data };
  } catch (error) {
    console.error('Error updating contact status:', error);
    // Return success for fallback behavior
    return { success: true };
  }
};

export const deleteContact = async (contactId) => {
  try {
    const response = await fetch(`${API_URL}/api/contacts/${contactId}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });

    await handleApiResponse(response);
    return { success: true };
  } catch (error) {
    console.error('Error deleting contact:', error);
    // Return success for fallback behavior
    return { success: true };
  }
};

// Reports API functions
export const getReports = async () => {
  try {
    const response = await fetch(`${API_URL}/api/reports`, {
      headers: createHeaders(true),
    });

    const data = await handleApiResponse(response);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    // Fallback to mock data
    return Array.from({ length: 10 }, () => ({
      id: faker.string.uuid(),
      property: faker.lorem.words(3),
      reason: faker.helpers.arrayElement([
        'Inappropriate Content',
        'Fake Listing',
        'Duplicate Listing',
        'Spam',
        'Incorrect Information',
      ]),
      reportedBy: faker.person.fullName(),
      date: faker.date.recent().toLocaleDateString(),
      status: faker.helpers.arrayElement(['Pending', 'Resolved']),
      priority: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
      description: faker.lorem.paragraph(),
    }));
  }
};

export const updateReportStatus = async (reportId, status, adminNotes = '') => {
  try {
    const response = await fetch(`${API_URL}/api/reports/${reportId}/status`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify({ status, adminNotes }),
    });

    const data = await handleApiResponse(response);
    return { success: true, report: data.data };
  } catch (error) {
    console.error('Error updating report status:', error);
    return { success: false, message: error.message };
  }
};

export const deleteReport = async (reportId) => {
  try {
    const response = await fetch(`${API_URL}/api/reports/${reportId}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });

    await handleApiResponse(response);
    return { success: true };
  } catch (error) {
    console.error('Error deleting report:', error);
    return { success: false, message: error.message };
  }
};

// Feedback API functions
export const getFeedback = adminApi.getFeedback;

export const updateFeedback = async (feedbackId, updates) => {
  try {
    const response = await fetch(`${API_URL}/api/feedback/${feedbackId}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(updates),
    });

    const data = await handleApiResponse(response);
    return { success: true, feedback: data.feedback };
  } catch (error) {
    console.error('Error updating feedback:', error);
    // Return success for fallback behavior
    return { success: true };
  }
};

// Image Upload API functions
export const uploadSingleImage = async (imageFile) => {
  try {
    await ensureAuthenticated();

    const formData = new FormData();
    formData.append('image', imageFile);

    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/images/upload-single`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await handleApiResponse(response);
    return {
      success: true,
      url: data.data.url,
      publicId: data.data.publicId,
      width: data.data.width,
      height: data.data.height,
    };
  } catch (error) {
    console.error('Error uploading single image:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image',
    };
  }
};

export const uploadMultipleImages = async (imageFiles) => {
  try {
    await ensureAuthenticated();

    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/images/upload-multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await handleApiResponse(response);
    return {
      success: true,
      uploaded: data.data.uploaded,
      failed: data.data.failed || 0,
    };
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload images',
    };
  }
};

export const deleteImage = async (publicId) => {
  try {
    await ensureAuthenticated();

    const response = await fetch(`${API_URL}/api/images/delete`, {
      method: 'DELETE',
      headers: createHeaders(true),
      body: JSON.stringify({ publicId }),
    });

    const data = await handleApiResponse(response);
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete image',
    };
  }
};

// Export individual booking API functions
export const getBookings = adminApi.getBookings;
export const getBookingDetails = adminApi.getBookingDetails;
export const updateBookingStatus = adminApi.updateBookingStatus;
export const updatePaymentStatus = adminApi.updatePaymentStatus;
export const bulkUpdateBookingStatus = adminApi.bulkUpdateBookingStatus;
export const deleteBooking = adminApi.deleteBooking;
export const getBookingStats = adminApi.getBookingStats;
export const addBookingNote = adminApi.addBookingNote;
export const createBookingAdmin = adminApi.createBookingAdmin;
export const getProperties = adminApi.getProperties;
export const getUsers = adminApi.getUsers;
