import asyncHandler from 'express-async-handler';
import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'buyer',
  });

  if (user) {
    generateToken(user, 201, res);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if account is locked
  if (user.isLocked) {
    res.status(423);
    throw new Error(
      'Account temporarily locked due to too many failed login attempts'
    );
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    // Record failed login attempt
    await user.incLoginAttempts();
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  generateToken(user, 200, res);
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      success: true,
      data: user,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Update profile fields
    if (req.body.profile) {
      user.profile = { ...user.profile, ...req.body.profile };
    }

    // Update preferences
    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: updatedUser,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

// @desc    Get dashboard stats for user
// @route   GET /api/auth/dashboard-stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  let stats = {};

  if (userRole === 'buyer') {
    // Import here to avoid circular dependency
    const Booking = (await import('../models/Booking.js')).default;
    const Wishlist = (await import('../models/Wishlist.js')).default;

    const userBookings = await Booking.find({ buyer: userId });
    const userWishlist = await Wishlist.find({ user: userId });

    stats = {
      totalBookings: userBookings.length,
      activeBookings: userBookings.filter((b) => b.status === 'confirmed')
        .length,
      pendingBookings: userBookings.filter((b) => b.status === 'pending')
        .length,
      wishlistCount: userWishlist.length,
      recentBookings: userBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3),
    };
  } else if (userRole === 'seller') {
    // Import here to avoid circular dependency
    const Property = (await import('../models/Property.js')).default;
    const Booking = (await import('../models/Booking.js')).default;

    const sellerProperties = await Property.find({ sellerId: userId });
    const propertyIds = sellerProperties.map((p) => p._id);
    const propertyBookings = await Booking.find({
      property: { $in: propertyIds },
    });

    const totalViews = sellerProperties.reduce(
      (sum, p) => sum + p.views.total,
      0
    );
    const totalEarnings = propertyBookings
      .filter((b) => b.payment.status === 'completed')
      .reduce((sum, b) => sum + b.payment.amount, 0);

    stats = {
      totalProperties: sellerProperties.length,
      activeListings: sellerProperties.filter((p) => p.status === 'available')
        .length,
      totalBookings: propertyBookings.length,
      pendingBookings: propertyBookings.filter((b) => b.status === 'pending')
        .length,
      totalViews,
      totalEarnings,
      recentBookings: propertyBookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3),
    };
  }

  res.json({
    success: true,
    data: stats,
  });
});

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully',
  });
});

// @desc    Get user profile by role
// @route   GET /api/auth/profile/:role
// @access  Private
export const getProfileByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;
  const userId = req.user.id;

  if (req.user.role !== role && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access this profile');
  }

  const user = await User.findById(userId);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Add role-specific data based on user role
  let profileData = { ...user.toObject() };
  
  if (role === 'seller') {
    // Import seller-specific data
    const Property = (await import('../models/Property.js')).default;
    const sellerProperties = await Property.find({ sellerId: userId });
    const activeListings = sellerProperties.filter(p => p.status === 'available');
    
    profileData.sellerStats = {
      totalProperties: sellerProperties.length,
      activeListings: activeListings.length,
      totalEarnings: 0, // You might want to calculate this from bookings
      averageRating: 0, // Calculate from reviews if available
    };
  } else if (role === 'buyer') {
    // Import buyer-specific data
    const Booking = (await import('../models/Booking.js')).default;
    const Wishlist = (await import('../models/Wishlist.js')).default;
    
    const bookings = await Booking.find({ buyer: userId });
    const wishlistItems = await Wishlist.find({ user: userId });
    
    profileData.buyerStats = {
      totalBookings: bookings.length,
      upcomingBookings: bookings.filter(b => new Date(b.checkInDate) > new Date()).length,
      wishlistCount: wishlistItems.length,
    };
  }

  res.json({
    success: true,
    data: profileData,
  });
});