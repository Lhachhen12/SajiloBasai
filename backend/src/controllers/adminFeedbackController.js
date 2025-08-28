import asyncHandler from 'express-async-handler';
import Feedback from '../models/Feedback.js';

// @desc    Get all feedback with filters and pagination
// @route   GET /api/admin/feedback
// @access  Private/Admin
export const getAllFeedback = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    rating,
    featured,
    showOnFrontend,
    type,
    search
  } = req.query;

  // Build query object
  let query = {};

  // Status filter
  if (status) {
    query.status = status;
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Rating filter
  if (rating) {
    query.rating = parseInt(rating);
  }

  // Featured filter
  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  // Frontend display filter
  if (showOnFrontend !== undefined) {
    query.showOnFrontend = showOnFrontend === 'true';
  }

  // Type filter
  if (type) {
    query.type = type;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { message: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: [
      { path: 'user', select: 'name email' },
      { path: 'resolvedBy', select: 'name' },
      { path: 'property', select: 'title' }
    ]
  };

  const feedback = await Feedback.paginate(query, options);

  res.json({
    success: true,
    data: feedback.docs,
    pagination: {
      current: feedback.page,
      pages: feedback.totalPages,
      total: feedback.totalDocs,
      limit: feedback.limit
    }
  });
});

// @desc    Get feedback statistics
// @route   GET /api/admin/feedback/stats
// @access  Private/Admin
export const getFeedbackStats = asyncHandler(async (req, res) => {
  const stats = await Feedback.aggregate([
    {
      $facet: {
        statusCounts: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ],
        categoryCounts: [
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ],
        ratingStats: [
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating' },
              totalFeedback: { $sum: 1 },
              featuredCount: {
                $sum: { $cond: ['$featured', 1, 0] }
              },
              frontendCount: {
                $sum: { $cond: ['$showOnFrontend', 1, 0] }
              }
            }
          }
        ]
      }
    }
  ]);

  // Format the response
  const result = {
    statusCounts: stats[0].statusCounts,
    categoryCounts: stats[0].categoryCounts,
    ratingStats: stats[0].ratingStats[0] || {
      averageRating: 0,
      totalFeedback: 0,
      featuredCount: 0,
      frontendCount: 0
    }
  };

  res.json({
    success: true,
    data: result
  });
});

// @desc    Update feedback status
// @route   PUT /api/admin/feedback/:id/status
// @access  Private/Admin
export const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status value'
    });
  }

  const updateData = { status };

  // If resolving feedback, set resolvedBy and resolvedAt
  if (status === 'resolved') {
    updateData.resolvedBy = req.user._id;
    updateData.resolvedAt = new Date();
  }

  const feedback = await Feedback.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('user', 'name email')
   .populate('resolvedBy', 'name');

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }

  res.json({
    success: true,
    message: 'Feedback status updated successfully',
    data: feedback
  });
});

// @desc    Update feedback properties
// @route   PUT /api/admin/feedback/:id
// @access  Private/Admin
export const updateFeedbackAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Remove fields that shouldn't be updated directly
  const allowedUpdates = [
    'status',
    'featured',
    'showOnFrontend',
    'adminNotes',
    'priority',
    'category',
    'rating',
    'adminResponse'
  ];

  const filteredUpdates = {};
  Object.keys(updates).forEach(key => {
    if (allowedUpdates.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  });

  // If updating admin response, add metadata
  if (filteredUpdates.adminResponse) {
    filteredUpdates.adminResponse.respondedBy = req.user._id;
    filteredUpdates.adminResponse.respondedAt = new Date();
  }

  const feedback = await Feedback.findByIdAndUpdate(
    id,
    filteredUpdates,
    { new: true, runValidators: true }
  ).populate('user', 'name email')
   .populate('resolvedBy', 'name')
   .populate('adminResponse.respondedBy', 'name');

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }

  res.json({
    success: true,
    message: 'Feedback updated successfully',
    data: feedback
  });
});

// @desc    Delete feedback
// @route   DELETE /api/admin/feedback/:id
// @access  Private/Admin
export const deleteFeedbackAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feedback = await Feedback.findByIdAndDelete(id);

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }

  res.json({
    success: true,
    message: 'Feedback deleted successfully'
  });
});

// @desc    Get public feedback for frontend
// @route   GET /api/admin/feedback/public
// @access  Public
export const getPublicFeedback = asyncHandler(async (req, res) => {
  const { limit = 10, featured } = req.query;

  let query = {
    showOnFrontend: true,
    status: 'resolved'
  };

  if (featured === 'true') {
    query.featured = true;
  }

  const feedback = await Feedback.find(query)
    .populate('user', 'name')
    .select('rating message name user featured createdAt category')
    .sort({ featured: -1, createdAt: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: feedback,
    count: feedback.length
  });
});