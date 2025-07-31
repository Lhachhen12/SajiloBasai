import asyncHandler from 'express-async-handler';
import User from '../models/user.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Feedback from '../models/Feedback.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, status, page = 1, limit = 10, search } = req.query;

  let query = {};
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    count: users.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: users,
  });
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get user's additional data
  const userProperties = await Property.find({ sellerId: req.params.id });
  const userBookings = await Booking.find({ buyer: req.params.id });

  res.json({
    success: true,
    data: {
      user,
      properties: userProperties,
      bookings: userBookings,
    },
  });
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
export const updateUser = asyncHandler(async (req, res) => {
  const { name, role, status, profile } = req.body;

  // Build update object
  const updateFields = {};
  if (name) updateFields.name = name;
  if (role) updateFields.role = role;
  if (status) updateFields.status = status;
  if (profile) updateFields.profile = { ...req.body.profile };

  const user = await User.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if user has active bookings or properties
  const activeBookings = await Booking.find({
    $or: [
      { buyer: req.params.id, status: { $in: ['pending', 'confirmed'] } },
      { seller: req.params.id, status: { $in: ['pending', 'confirmed'] } },
    ],
  });

  if (activeBookings.length > 0) {
    res.status(400);
    throw new Error('Cannot delete user with active bookings');
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProperties = await Property.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const totalRevenue = await Booking.aggregate([
    {
      $match: {
        status: 'completed',
        'payment.status': 'completed',
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$commission' },
      },
    },
  ]);

  // Recent activity
  const recentUsers = await User.find()
    .select('name email role createdAt')
    .sort('-createdAt')
    .limit(5);

  const recentProperties = await Property.find()
    .select('title price location createdAt')
    .populate('sellerId', 'name')
    .sort('-createdAt')
    .limit(5);

  const recentBookings = await Booking.find()
    .select('status payment.amount createdAt')
    .populate('property', 'title')
    .populate('buyer', 'name')
    .sort('-createdAt')
    .limit(5);

  // User role distribution
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ]);

  // Properties by type
  const propertiesByType = await Property.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);

  // Bookings by status
  const bookingsByStatus = await Booking.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Active sellers count (users with role seller and status active)
  const activeSellers = await User.countDocuments({
    role: 'seller',
    status: 'active',
  });

  // Total visits/views from all properties
  const totalVisits = await Property.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$views.total' },
      },
    },
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalListings: totalProperties,
      totalBookings,
      totalVisits: totalVisits.length > 0 ? totalVisits[0].total : 0,
      activeSellers,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    },
    recentActivity: {
      users: recentUsers,
      properties: recentProperties,
      bookings: recentBookings,
    },
    analytics: {
      usersByRole,
      propertiesByType,
      bookingsByStatus,
    },
  });
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalyticsData = asyncHandler(async (req, res) => {
  const { period = '7d' } = req.query;

  let startDate;
  switch (period) {
    case '7d':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }

  // Generate daily labels for the last 7 days
  const dailyLabels = [];
  const dailyVisits = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dailyLabels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

    // For now, we'll generate some sample data since we don't have real visit tracking
    // In a real app, you'd track daily visits in your database
    dailyVisits.push(Math.floor(Math.random() * 500) + 100);
  }

  // Daily registrations
  const dailyRegistrations = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Daily property listings
  const dailyListings = await Property.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Daily bookings
  const dailyBookings = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
        revenue: { $sum: '$commission' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Top cities by property count
  const topCities = await Property.aggregate([
    {
      $group: {
        _id: '$location',
        value: { $sum: 1 },
      },
    },
    {
      $project: {
        name: '$_id',
        value: 1,
        _id: 0,
      },
    },
    {
      $sort: { value: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  res.json({
    success: true,
    analytics: {
      dailyVisits,
      weeklyLabels: dailyLabels,
      topCities,
      dailyRegistrations,
      dailyListings,
      dailyBookings,
    },
  });
});

// @desc    Get all feedback
// @route   GET /api/admin/feedback
// @access  Private (Admin)
export const getAllFeedback = asyncHandler(async (req, res) => {
  const { type, status, priority, page = 1, limit = 10 } = req.query;

  let query = {};
  if (type) query.type = type;
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const feedback = await Feedback.find(query)
    .populate('user', 'name email')
    .populate('property', 'title')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Feedback.countDocuments(query);

  res.json({
    success: true,
    count: feedback.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: feedback,
  });
});

// @desc    Update feedback status
// @route   PUT /api/admin/feedback/:id/status
// @access  Private (Admin)
export const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const { status, response } = req.body;

  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }

  feedback.status = status;

  if (response) {
    feedback.adminResponse = {
      message: response,
      respondedBy: req.user._id,
      respondedAt: new Date(),
    };
  }

  await feedback.save();

  const updatedFeedback = await Feedback.findById(req.params.id)
    .populate('user', 'name email')
    .populate('adminResponse.respondedBy', 'name');

  res.json({
    success: true,
    data: updatedFeedback,
  });
});

// @desc    Get recent listings for dashboard
// @route   GET /api/admin/recent-listings
// @access  Private (Admin)
export const getRecentListings = asyncHandler(async (req, res) => {
  const { limit = 4 } = req.query;

  const recentListings = await Property.find()
    .select('title type location price status createdAt')
    .populate('sellerId', 'name')
    .sort('-createdAt')
    .limit(parseInt(limit));

  // Format the data for the dashboard
  const formattedListings = recentListings.map((listing) => ({
    id: listing._id,
    title: listing.title,
    type: listing.type,
    location: listing.location,
    price: listing.price,
    status: listing.status === 'available' ? 'Active' : 'Pending',
    owner: listing.sellerId?.name || 'Unknown',
    image:
      listing.images && listing.images.length > 0
        ? listing.images[0]
        : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200',
    views: listing.views?.total || 0,
    likes: Math.floor(Math.random() * 50), // Placeholder for likes
  }));

  res.json({
    success: true,
    data: formattedListings,
  });
});

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin)
export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.user._id).select('-password');

  if (!admin) {
    res.status(404);
    throw new Error('Admin profile not found');
  }

  // Get admin activity stats
  const totalUsers = await User.countDocuments();
  const totalProperties = await Property.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const pendingFeedbacks = await Feedback.countDocuments({
    status: { $in: ['pending', 'new'] },
  });

  // Get recent admin activities (you can enhance this based on your needs)
  const recentActivities = [
    {
      action: 'Profile Accessed',
      timestamp: new Date(),
      description: 'Admin profile accessed',
    },
  ];

  res.json({
    success: true,
    data: {
      profile: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone || 'Not provided',
        avatar: admin.avatar || null,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin || admin.updatedAt,
        status: admin.status || 'active',
      },
      stats: {
        totalUsers,
        totalProperties,
        totalBookings,
        pendingFeedbacks,
      },
      recentActivities,
    },
  });
});

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin)
export const updateAdminProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;

  const admin = await User.findById(req.user._id);

  if (!admin) {
    res.status(404);
    throw new Error('Admin not found');
  }

  // Update fields
  if (name) admin.name = name;
  if (phone) admin.phone = phone;
  if (avatar) admin.avatar = avatar;

  await admin.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      phone: admin.phone,
      avatar: admin.avatar,
    },
  });
});

// @desc    Get all properties for admin with filters
// @route   GET /api/admin/properties
// @access  Private (Admin)
export const getAllPropertiesAdmin = asyncHandler(async (req, res) => {
  const {
    status,
    type,
    location,
    page = 1,
    limit = 10,
    search,
    sort = '-createdAt',
  } = req.query;

  let query = {};

  // Build query based on filters
  if (status) {
    query.status = status;
  }

  if (type) {
    query.type = type;
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const properties = await Property.find(query)
    .populate('sellerId', 'name email profile.phone')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Property.countDocuments(query);

  // Format properties for admin
  const formattedProperties = properties.map((property) => ({
    id: property._id,
    title: property.title,
    type: property.type,
    price: property.price,
    location: property.location,
    status:
      property.status === 'available'
        ? 'Active'
        : property.status === 'pending'
        ? 'Pending'
        : 'Inactive',
    owner: property.sellerId?.name || 'Unknown',
    created: property.createdAt.toLocaleDateString(),
    images: property.images || [],
    views: property.views?.total || 0,
    featured: property.featured || false,
    description: property.description,
    amenities: property.features || {},
  }));

  res.json({
    success: true,
    count: formattedProperties.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    properties: formattedProperties,
  });
});

// @desc    Update property status (approve/reject/activate/deactivate)
// @route   PUT /api/admin/properties/:id/status
// @access  Private (Admin)
export const updatePropertyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const propertyId = req.params.id;

  const property = await Property.findById(propertyId);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Validate status
  const validStatuses = [
    'available',
    'pending',
    'rejected',
    'sold',
    'inactive',
  ];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  property.status = status;
  await property.save();

  res.json({
    success: true,
    message: `Property status updated to ${status}`,
    data: {
      id: property._id,
      title: property.title,
      status: property.status,
    },
  });
});

// @desc    Toggle property featured status
// @route   PUT /api/admin/properties/:id/featured
// @access  Private (Admin)
export const togglePropertyFeatured = asyncHandler(async (req, res) => {
  const propertyId = req.params.id;

  const property = await Property.findById(propertyId);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  property.featured = !property.featured;
  await property.save();

  res.json({
    success: true,
    message: `Property ${
      property.featured ? 'added to' : 'removed from'
    } featured`,
    data: {
      id: property._id,
      title: property.title,
      featured: property.featured,
    },
  });
});

// @desc    Delete property (admin)
// @route   DELETE /api/admin/properties/:id
// @access  Private (Admin)
export const deletePropertyAdmin = asyncHandler(async (req, res) => {
  const propertyId = req.params.id;

  const property = await Property.findById(propertyId);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  await Property.findByIdAndDelete(propertyId);

  res.json({
    success: true,
    message: 'Property deleted successfully',
  });
});

// @desc    Get property details for admin
// @route   GET /api/admin/properties/:id
// @access  Private (Admin)
export const getPropertyDetailsAdmin = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('sellerId', 'name email profile.phone profile.address')
    .populate('reviews.user', 'name');

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  res.json({
    success: true,
    data: property,
  });
});

// @desc    Bulk update properties status
// @route   PUT /api/admin/properties/bulk-status
// @access  Private (Admin)
export const bulkUpdatePropertiesStatus = asyncHandler(async (req, res) => {
  const { propertyIds, status } = req.body;

  if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
    res.status(400);
    throw new Error('Property IDs are required');
  }

  const validStatuses = [
    'available',
    'pending',
    'rejected',
    'sold',
    'inactive',
  ];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const result = await Property.updateMany(
    { _id: { $in: propertyIds } },
    { status }
  );

  res.json({
    success: true,
    message: `${result.modifiedCount} properties updated successfully`,
    data: {
      modifiedCount: result.modifiedCount,
      status,
    },
  });
});

// @desc    Create property (admin)
// @route   POST /api/admin/properties
// @access  Private (Admin)
export const createPropertyAdmin = asyncHandler(async (req, res) => {
  const propertyData = {
    ...req.body,
    sellerId: req.body.sellerId || req.user._id, // Allow admin to create for any seller or themselves
  };

  const property = await Property.create(propertyData);

  const populatedProperty = await Property.findById(property._id).populate(
    'sellerId',
    'name email profile.phone'
  );

  res.status(201).json({
    success: true,
    message: 'Property created successfully',
    data: populatedProperty,
  });
});
