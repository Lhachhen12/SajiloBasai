// Mock booking data and functions

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
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
    },
    buyer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    seller: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    }
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
      imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227'
    },
    buyer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    seller: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    }
  }
];

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get bookings by buyer ID
export const getBookingsByBuyerId = async (buyerId) => {
  await delay(500);
  return BOOKINGS.filter(booking => booking.buyerId === buyerId);
};

// Get bookings by seller ID
export const getBookingsBySellerId = async (sellerId) => {
  await delay(500);
  return BOOKINGS.filter(booking => booking.sellerId === sellerId);
};

// Create a new booking
export const createBooking = async (bookingData) => {
  await delay(800);
  
  const newBooking = {
    id: BOOKINGS.length + 1,
    status: 'pending',
    commission: bookingData.totalAmount * 0.05, // 5% commission
    createdAt: new Date().toISOString().split('T')[0],
    ...bookingData
  };
  
  BOOKINGS.push(newBooking);
  return { success: true, booking: newBooking };
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  await delay(400);
  
  const booking = BOOKINGS.find(b => b.id === bookingId);
  if (booking) {
    booking.status = status;
    return { success: true, booking };
  }
  
  return { success: false, message: 'Booking not found' };
};

// Get seller earnings summary
export const getSellerEarningsSummary = async (sellerId) => {
  await delay(600);
  
  const sellerBookings = BOOKINGS.filter(
    booking => booking.sellerId === sellerId && booking.status === 'approved'
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
    totalBookings: sellerBookings.length
  };
};