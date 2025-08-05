import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import User from '../models/user.js';
import { trackBookingEvent } from '../middlewares/analytics.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Buyer)
export const createBooking = asyncHandler(async (req, res) => {
  const { propertyId, contactInfo, bookingDetails, paymentMethod } = req.body;

  // Check if property exists and is available
  const property = await Property.findById(propertyId).populate('sellerId');

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.status !== 'available') {
    res.status(400);
    throw new Error('Property is not available for booking');
  }

  // Prevent self-booking (seller cannot book their own property)
  if (property.sellerId._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot book your own property');
  }

  // Check for overlapping bookings
  const checkInDate = new Date(bookingDetails.checkInDate);
  const checkOutDate = bookingDetails.checkOutDate
    ? new Date(bookingDetails.checkOutDate)
    : new Date(
        checkInDate.getTime() +
          bookingDetails.duration * 30 * 24 * 60 * 60 * 1000
      );

  const overlappingBookings = await Booking.find({
    property: propertyId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        'bookingDetails.checkInDate': { $lt: checkOutDate },
        'bookingDetails.checkOutDate': { $gt: checkInDate },
      },
    ],
  });

  if (overlappingBookings.length > 0) {
    res.status(400);
    throw new Error('Property is already booked for the selected dates');
  }

  // Calculate payment amount (property price * duration)
  const paymentAmount = property.price * bookingDetails.duration;

  const booking = await Booking.create({
    property: propertyId,
    buyer: req.user._id,
    seller: property.sellerId._id,
    contactInfo,
    bookingDetails: {
      ...bookingDetails,
      checkOutDate: checkOutDate,
    },
    payment: {
      method: paymentMethod,
      amount: paymentAmount,
    },
  });

  // Populate the booking
  const populatedBooking = await Booking.findById(booking._id)
    .populate('property', 'title price location images address type')
    .populate('buyer', 'name email profile.phone')
    .populate('seller', 'name email profile.phone');

  // Track booking start event
  await trackBookingEvent(
    'booking_start',
    {
      id: booking._id,
      propertyId: propertyId,
      amount: paymentAmount,
    },
    req
  );

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: populatedBooking,
  });
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
export const getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, paymentStatus } = req.query;

  let query = {};
  if (status) query.status = status;
  if (paymentStatus) query['payment.status'] = paymentStatus;

  const bookings = await Booking.find(query)
    .populate('property', 'title price location images')
    .populate('buyer', 'name email profile.phone')
    .populate('seller', 'name email profile.phone')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Booking.countDocuments(query);

  res.json({
    success: true,
    count: bookings.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: bookings,
  });
});

// @desc    Get bookings by buyer
// @route   GET /api/bookings/buyer/:buyerId
// @access  Private (Buyer - own bookings or Admin)
export const getBookingsByBuyer = asyncHandler(async (req, res) => {
  const { buyerId } = req.params;
  const { page = 1, limit = 10, status } = req.query;

  // Check if user is accessing their own bookings or is admin
  if (req.user._id.toString() !== buyerId && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access these bookings');
  }

  let query = { buyer: buyerId };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate('property', 'title price location images')
    .populate('seller', 'name email profile.phone')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Booking.countDocuments(query);

  res.json({
    success: true,
    count: bookings.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: bookings,
  });
});

// @desc    Get bookings by seller
// @route   GET /api/bookings/seller/:sellerId
// @access  Private (Seller - own bookings or Admin)
export const getBookingsBySeller = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;
  const { page = 1, limit = 10, status } = req.query;

  // Check if user is accessing their own bookings or is admin
  if (req.user._id.toString() !== sellerId && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access these bookings');
  }

  let query = { seller: sellerId };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate('property', 'title price location images')
    .populate('buyer', 'name email profile.phone')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Booking.countDocuments(query);

  res.json({
    success: true,
    count: bookings.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: bookings,
  });
});

// @desc    Get my bookings (for buyers)
// @route   GET /api/bookings/my-bookings
// @access  Private (Buyer)
export const getMyBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = { buyer: req.user._id };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate('property', 'title price location images')
    .populate('seller', 'name email profile.phone')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Booking.countDocuments(query);

  res.json({
    success: true,
    count: bookings.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: bookings,
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private (Related parties or Admin)
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('property', 'title price location images')
    .populate('buyer', 'name email profile.phone')
    .populate('seller', 'name email profile.phone');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is authorized to view this booking
  const isAuthorized =
    booking.buyer._id.toString() === req.user._id.toString() ||
    booking.seller._id.toString() === req.user._id.toString() ||
    req.user.role === 'admin';

  if (!isAuthorized) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json({
    success: true,
    data: booking,
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Seller for their properties or Admin)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id)
    .populate('property')
    .populate('buyer', 'name email')
    .populate('seller', 'name email');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is authorized to update this booking
  const isAuthorized =
    booking.seller._id.toString() === req.user._id.toString() ||
    req.user.role === 'admin';

  if (!isAuthorized) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  // Validate status transitions
  const validStatuses = [
    'pending',
    'confirmed',
    'rejected',
    'cancelled',
    'completed',
  ];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid booking status');
  }

  booking.status = status;

  // If booking is confirmed, update property status
  if (status === 'confirmed') {
    await Property.findByIdAndUpdate(booking.property._id, {
      status: 'rented',
    });
  }

  // If booking is rejected or cancelled, make property available again
  if (status === 'rejected' || status === 'cancelled') {
    await Property.findByIdAndUpdate(booking.property._id, {
      status: 'available',
    });
  }

  await booking.save();

  res.json({
    success: true,
    data: booking,
  });
});

// @desc    Process payment
// @route   PUT /api/bookings/:id/payment
// @access  Private (Buyer)
export const processPayment = asyncHandler(async (req, res) => {
  const { paymentMethod, transactionId } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is the buyer
  if (booking.buyer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to process payment for this booking');
  }

  // Update payment details
  booking.payment.method = paymentMethod;
  booking.payment.status = 'completed';
  booking.payment.paymentDate = new Date();

  if (transactionId) {
    booking.payment.transactionId = transactionId;
  }

  await booking.save();

  // Track booking completion event
  await trackBookingEvent(
    'booking_complete',
    {
      id: booking._id,
      propertyId: booking.property,
      amount: booking.payment.amount,
    },
    req
  );

  res.json({
    success: true,
    message: 'Payment processed successfully',
    data: booking,
  });
});

// @desc    Add note to booking
// @route   POST /api/bookings/:id/notes
// @access  Private (Related parties or Admin)
export const addBookingNote = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is authorized to add notes
  const isAuthorized =
    booking.buyer.toString() === req.user._id.toString() ||
    booking.seller.toString() === req.user._id.toString() ||
    req.user.role === 'admin';

  if (!isAuthorized) {
    res.status(403);
    throw new Error('Not authorized to add notes to this booking');
  }

  booking.notes.push({
    content,
    addedBy: req.user._id,
  });

  await booking.save();

  // Populate the booking with updated notes
  const updatedBooking = await Booking.findById(booking._id).populate(
    'notes.addedBy',
    'name'
  );

  res.json({
    success: true,
    data: updatedBooking,
  });
});

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private (Admin)
export const getBookingStats = asyncHandler(async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: 'pending' });
  const confirmedBookings = await Booking.countDocuments({
    status: 'confirmed',
  });
  const completedBookings = await Booking.countDocuments({
    status: 'completed',
  });

  // Total revenue (commission from completed bookings)
  const revenueData = await Booking.aggregate([
    {
      $match: {
        status: 'completed',
        'payment.status': 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$commission' },
        totalBookingValue: { $sum: '$payment.amount' },
      },
    },
  ]);

  const revenue =
    revenueData.length > 0
      ? revenueData[0]
      : { totalRevenue: 0, totalBookingValue: 0 };

  res.json({
    success: true,
    data: {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      ...revenue,
    },
  });
});

// @desc    Admin: Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
export const deleteBookingAdmin = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  await Booking.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Booking deleted successfully',
  });
});

// @desc    Admin: Bulk update booking status
// @route   PUT /api/bookings/bulk-status
// @access  Private (Admin)
export const bulkUpdateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingIds, status } = req.body;

  if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
    res.status(400);
    throw new Error('Booking IDs array is required');
  }

  if (
    !['pending', 'confirmed', 'rejected', 'cancelled', 'completed'].includes(
      status
    )
  ) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const result = await Booking.updateMany(
    { _id: { $in: bookingIds } },
    {
      status,
      updatedAt: Date.now(),
    }
  );

  res.json({
    success: true,
    message: `Successfully updated ${result.modifiedCount} bookings`,
    modifiedCount: result.modifiedCount,
  });
});

// @desc    Admin: Get booking details with full information
// @route   GET /api/bookings/:id/details
// @access  Private (Admin)
export const getBookingDetailsAdmin = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'property',
      select:
        'title description price location images features amenities type status',
      populate: {
        path: 'sellerId',
        select: 'name email profile',
      },
    })
    .populate('buyer', 'name email profile')
    .populate('seller', 'name email profile')
    .populate('notes.addedBy', 'name email');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  res.json({
    success: true,
    data: booking,
  });
});

// @desc    Admin: Update booking payment status
// @route   PUT /api/bookings/:id/payment-status
// @access  Private (Admin)
export const updatePaymentStatusAdmin = asyncHandler(async (req, res) => {
  const { paymentStatus, transactionId } = req.body;

  if (!['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)) {
    res.status(400);
    throw new Error('Invalid payment status');
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  booking.payment.status = paymentStatus;
  if (transactionId) {
    booking.payment.transactionId = transactionId;
  }
  if (paymentStatus === 'completed') {
    booking.payment.paymentDate = new Date();
  }

  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate('property', 'title price location')
    .populate('buyer', 'name email')
    .populate('seller', 'name email');

  res.json({
    success: true,
    message: 'Payment status updated successfully',
    data: updatedBooking,
  });
});

// @desc    Admin: Create new booking
// @route   POST /api/admin/bookings
// @access  Private (Admin)
export const createBookingAdmin = asyncHandler(async (req, res) => {
  const {
    propertyId,
    buyerId,
    sellerId,
    contactInfo,
    bookingDetails,
    payment,
    status = 'pending',
    notes = [],
  } = req.body;

  // Validate required fields
  if (
    !propertyId ||
    !buyerId ||
    !sellerId ||
    !contactInfo ||
    !bookingDetails ||
    !payment
  ) {
    res.status(400);
    throw new Error('All required fields must be provided');
  }

  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check if buyer exists - handle both ObjectId and display string formats
  let buyer;
  try {
    // Try to find by ObjectId first
    buyer = await User.findById(buyerId);
  } catch (error) {
    // If ObjectId cast fails, try to parse from display string
    if (buyerId.includes(' - ') && buyerId.includes('@')) {
      const email = buyerId.split(' - ')[1].split(' (')[0];
      buyer = await User.findOne({ email });
    }
  }

  if (!buyer) {
    res.status(404);
    throw new Error('Buyer not found');
  }

  // Check if seller exists - handle both ObjectId and display string formats
  let seller;
  try {
    // Try to find by ObjectId first
    seller = await User.findById(sellerId);
  } catch (error) {
    // If ObjectId cast fails, try to parse from display string
    if (sellerId.includes(' - ') && sellerId.includes('@')) {
      const email = sellerId.split(' - ')[1].split(' (')[0];
      seller = await User.findOne({ email });
    }
  }

  if (!seller) {
    res.status(404);
    throw new Error('Seller not found');
  }

  // Create booking with all provided data
  const booking = await Booking.create({
    property: propertyId,
    buyer: buyer._id,
    seller: seller._id,
    contactInfo: {
      name: contactInfo.name,
      email: contactInfo.email,
      phone: contactInfo.phone,
    },
    bookingDetails: {
      numberOfPeople: bookingDetails.numberOfPeople,
      hasPets: bookingDetails.hasPets || false,
      useType: bookingDetails.useType,
      message: bookingDetails.message || '',
      checkInDate: bookingDetails.checkInDate,
      checkOutDate: bookingDetails.checkOutDate,
      duration: bookingDetails.duration,
    },
    payment: {
      method: payment.method,
      status: payment.status || 'pending',
      amount: payment.amount,
      transactionId: payment.transactionId || '',
      paymentDate: payment.paymentDate || null,
    },
    status,
    notes: notes.map((note) => ({
      content: note.content,
      addedBy: req.user._id,
      addedAt: new Date(),
    })),
  });

  // Populate the booking with related data
  const populatedBooking = await Booking.findById(booking._id)
    .populate('property', 'title price location images address')
    .populate('buyer', 'name email profile.phone')
    .populate('seller', 'name email profile.phone')
    .populate('notes.addedBy', 'name');

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: populatedBooking,
  });
});
