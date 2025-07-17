// Mock API data and functions
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
    description: 'A beautifully designed single room with attached kitchen and sleeping area.',
    price: 8000,
    type: 'room',
    roomType: 'single-kitchen',
    location: 'Kathmandu',
    area: 200,
    imageUrl: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
    sellerId: 2,
    status: 'available',
    views: { total: 156, loggedIn: 89, anonymous: 67 },
    featured: true
  },
  {
    id: 2,
    title: 'Cozy Double Room',
    description: 'Spacious double room with shared kitchen and bathroom facilities.',
    price: 12000,
    type: 'room',
    roomType: 'double',
    location: 'Patan',
    area: 250,
    imageUrl: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    sellerId: 2,
    status: 'available',
    views: { total: 98, loggedIn: 45, anonymous: 53 },
    featured: false
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
    imageUrl: 'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg',
    sellerId: 3,
    status: 'available',
    views: { total: 210, loggedIn: 120, anonymous: 90 },
    featured: true
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
    imageUrl: 'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg',
    sellerId: 3,
    status: 'available',
    views: { total: 87, loggedIn: 32, anonymous: 55 },
    featured: false
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
    imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    sellerId: 2,
    status: 'available',
    views: { total: 234, loggedIn: 145, anonymous: 89 },
    featured: true
  },
  {
    id: 6,
    title: 'Luxury 3BHK Apartment',
    description: 'Premium apartment with modern amenities and stunning city views.',
    price: 35000,
    type: 'flat',
    flatType: '3bhk',
    location: 'Kathmandu',
    area: 1200,
    imageUrl: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg',
    sellerId: 2,
    status: 'available',
    views: { total: 312, loggedIn: 198, anonymous: 114 },
    featured: true
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
    imageUrl: 'https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg',
    sellerId: 3,
    status: 'available',
    views: { total: 145, loggedIn: 78, anonymous: 67 },
    featured: false
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
    imageUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    sellerId: 3,
    status: 'available',
    views: { total: 189, loggedIn: 112, anonymous: 77 },
    featured: true
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
    imageUrl: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
    sellerId: 2,
    status: 'available',
    views: { total: 132, loggedIn: 65, anonymous: 67 },
    featured: false
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
    imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    sellerId: 3,
    status: 'available',
    views: { total: 167, loggedIn: 98, anonymous: 69 },
    featured: true
  }
];

const WISHLIST = [
  { userId: 1, propertyId: 1 },
  { userId: 1, propertyId: 3 },
  { userId: 1, propertyId: 6 }
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
    createdAt: new Date().toISOString()
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
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Helper function to simulate API delay
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const loginUser = async (email, password) => {
  await delay(500);
  const user = USERS.find(user => user.email === email);
  
  if (user) {
    return { success: true, user };
  }
  
  return { success: false, message: 'Invalid credentials' };
};

export const registerUser = async (userData) => {
  await delay(800);
  const newUser = {
    id: USERS.length + 1,
    ...userData
  };
  
  USERS.push(newUser);
  return { success: true, user: newUser };
};

export const getFeaturedProperties = async () => {
  await delay(600);
  return PROPERTIES.filter(property => property.featured);
};

export const getAllProperties = async (filters = {}) => {
  await delay(700);
  
  let filteredProperties = [...PROPERTIES];
  
  if (filters.location) {
    filteredProperties = filteredProperties.filter(
      property => property.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  if (filters.type) {
    filteredProperties = filteredProperties.filter(
      property => property.type === filters.type
    );
  }
  
  if (filters.minPrice) {
    filteredProperties = filteredProperties.filter(
      property => property.price >= filters.minPrice
    );
  }
  
  if (filters.maxPrice) {
    filteredProperties = filteredProperties.filter(
      property => property.price <= filters.maxPrice
    );
  }
  
  return filteredProperties;
};

export const getPropertyById = async (id) => {
  await delay(400);
  const property = PROPERTIES.find(property => property.id === parseInt(id));
  
  if (property) {
    property.views.total += 1;
    property.views.anonymous += 1;
    
    return { success: true, property };
  }
  
  return { success: false, message: 'Property not found' };
};

export const createBooking = async (bookingData) => {
  await delay(800);
  
  const newBooking = {
    id: BOOKINGS.length + 1,
    ...bookingData,
    paymentStatus: 'pending',
    bookingStatus: 'pending',
    createdAt: new Date().toISOString()
  };
  
  BOOKINGS.push(newBooking);
  return { success: true, booking: newBooking };
};

export const processPayment = async (bookingId, method) => {
  await delay(1000);
  
  const booking = BOOKINGS.find(b => b.id === bookingId);
  if (booking) {
    booking.paymentMethod = method;
    booking.paymentStatus = 'completed';
    booking.bookingStatus = 'confirmed';
    
    return { 
      success: true, 
      message: 'Payment processed successfully',
      booking
    };
  }
  
  return { success: false, message: 'Booking not found' };
};

export const getWishlistByUserId = async (userId) => {
  await delay(600);
  const wishlistIds = WISHLIST
    .filter(item => item.userId === userId)
    .map(item => item.propertyId);
  
  const wishlistProperties = PROPERTIES.filter(
    property => wishlistIds.includes(property.id)
  );
  
  return wishlistProperties;
};

export const addToWishlist = async (userId, propertyId) => {
  await delay(300);
  
  const existingItem = WISHLIST.find(
    item => item.userId === userId && item.propertyId === propertyId
  );
  
  if (existingItem) {
    return { success: false, message: 'Property already in wishlist' };
  }
  
  WISHLIST.push({ userId, propertyId });
  return { success: true, message: 'Added to wishlist' };
};

export const removeFromWishlist = async (userId, propertyId) => {
  await delay(300);
  
  const initialLength = WISHLIST.length;
  
  const updatedWishlist = WISHLIST.filter(
    item => !(item.userId === userId && item.propertyId === propertyId)
  );
  
  WISHLIST.length = 0;
  WISHLIST.push(...updatedWishlist);
  
  if (WISHLIST.length < initialLength) {
    return { success: true, message: 'Removed from wishlist' };
  }
  
  return { success: false, message: 'Property not in wishlist' };
};

export const getBookingsByUserId = async (userId) => {
  await delay(500);
  return BOOKINGS.filter(booking => booking.userId === userId).map(booking => ({
    ...booking,
    property: PROPERTIES.find(p => p.id === booking.propertyId)
  }));
};

export const getBookingsBySellerId = async (sellerId) => {
  await delay(500);
  const sellerProperties = PROPERTIES.filter(p => p.sellerId === sellerId);
  return BOOKINGS
    .filter(booking => sellerProperties.some(p => p.id === booking.propertyId))
    .map(booking => ({
      ...booking,
      property: PROPERTIES.find(p => p.id === booking.propertyId),
      user: USERS.find(u => u.id === booking.userId)
    }));
};

export const getBuyerDashboardStats = async (userId) => {
  await delay(500);
  
  const userBookings = BOOKINGS.filter(booking => booking.userId === userId);
  const userWishlist = WISHLIST.filter(item => item.userId === userId);
  
  return {
    totalBookings: userBookings.length,
    activeBookings: userBookings.filter(b => b.bookingStatus === 'confirmed').length,
    pendingBookings: userBookings.filter(b => b.bookingStatus === 'pending').length,
    wishlistCount: userWishlist.length,
    recentBookings: userBookings.slice(-3).map(booking => ({
      ...booking,
      property: PROPERTIES.find(p => p.id === booking.propertyId)
    }))
  };
};

export const getSellerDashboardStats = async (sellerId) => {
  await delay(500);
  
  const sellerProperties = PROPERTIES.filter(p => p.sellerId === sellerId);
  const propertyIds = sellerProperties.map(p => p.id);
  const propertyBookings = BOOKINGS.filter(b => propertyIds.includes(b.propertyId));
  
  const totalViews = sellerProperties.reduce((sum, p) => sum + p.views.total, 0);
  const totalEarnings = propertyBookings
    .filter(b => b.paymentStatus === 'completed')
    .reduce((sum, b) => {
      const property = PROPERTIES.find(p => p.id === b.propertyId);
      return sum + property.price;
    }, 0);
    
  return {
    totalProperties: sellerProperties.length,
    activeListings: sellerProperties.filter(p => p.status === 'available').length,
    totalBookings: propertyBookings.length,
    pendingBookings: propertyBookings.filter(b => b.bookingStatus === 'pending').length,
    totalViews,
    totalEarnings,
    recentBookings: propertyBookings.slice(-3).map(booking => ({
      ...booking,
      property: PROPERTIES.find(p => p.id === booking.propertyId),
      user: USERS.find(u => u.id === booking.userId)
    }))
  };
};

export const addProperty = async (propertyData) => {
  await delay(800);
  
  const newProperty = {
    id: PROPERTIES.length + 1,
    ...propertyData,
    views: {
      total: 0,
      loggedIn: 0,
      anonymous: 0
    },
    status: 'available',
    featured: false
  };
  
  PROPERTIES.push(newProperty);
  return { success: true, property: newProperty };
};

export const deleteProperty = async (propertyId) => {
  await delay(500);
  
  const propertyIndex = PROPERTIES.findIndex(p => p.id === propertyId);
  
  if (propertyIndex === -1) {
    return { success: false, message: 'Property not found' };
  }
  
  // Remove the property from the PROPERTIES array
  PROPERTIES.splice(propertyIndex, 1);
  
  // Remove any associated wishlist items
  const updatedWishlist = WISHLIST.filter(item => item.propertyId !== propertyId);
  WISHLIST.length = 0;
  WISHLIST.push(...updatedWishlist);
  
  return { success: true, message: 'Property deleted successfully' };
};

export const getPropertiesBySellerId = async (sellerId) => {
  await delay(500);
  return PROPERTIES.filter(property => property.sellerId === sellerId);
};