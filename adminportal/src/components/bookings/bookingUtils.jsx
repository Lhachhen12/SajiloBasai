export const filterBookings = (bookings, searchTerm, paymentStatusFilter) => {
  return bookings.filter(booking => {
    const matchesSearch = 
      (booking.buyerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (booking.propertyId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (booking.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesPaymentStatus = paymentStatusFilter === 'all' || 
      (booking.paymentStatus?.toLowerCase() || '') === paymentStatusFilter.toLowerCase();
    
    return matchesSearch && matchesPaymentStatus;
  });
};

export const paginateBookings = (bookings, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return {
    paginatedBookings: bookings.slice(startIndex, endIndex),
    totalPages: Math.ceil(bookings.length / itemsPerPage)
  };
};

export const initializeFormData = (booking = {}) => ({
  buyerName: booking.buyerName || '',
  email: booking.email || '',
  propertyId: booking.propertyId || '',
  checkInDate: booking.checkInDate || '',
  duration: booking.duration || '',
  totalAmount: booking.totalAmount || '',
  paymentStatus: booking.paymentStatus || 'pending',
  bookingDate: booking.bookingDate || new Date().toISOString().split('T')[0]
});