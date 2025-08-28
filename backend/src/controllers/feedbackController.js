import asyncHandler from 'express-async-handler';
import Feedback from '../models/Feedback.js';
import { validationResult } from 'express-validator';

// @desc    Create feedback (both authenticated and anonymous)
// @route   POST /api/feedback/submit or POST /api/feedback/
// @access  Public/Private
export const createFeedback = asyncHandler(async (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { rating, message, category, name, email, subject, type } = req.body;
  
  // Validate anonymous user data
  if (!req.user && (!name || !email)) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required for anonymous feedback',
      errors: [
        { path: 'name', msg: 'Name is required for anonymous feedback' },
        { path: 'email', msg: 'Email is required for anonymous feedback' }
      ]
    });
  }

  // Create feedback object
  const feedbackData = {
    rating: parseInt(rating),
    message: message.trim(),
    category: category || 'general',
    type: type || 'general'
  };

  // Add subject if provided
  if (subject) {
    feedbackData.subject = subject.trim();
  }

  // If user is authenticated, use their ID
  if (req.user && req.user._id) {
    feedbackData.user = req.user._id;
  } else {
    // For anonymous feedback, use provided name and email
    feedbackData.name = name.trim();
    feedbackData.email = email.trim().toLowerCase();
  }

  try {
    const feedback = await Feedback.create(feedbackData);

    // Populate user info if exists
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('user', 'name email')
      .populate('property', 'title')
      .populate('booking');

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you for your input!',
      data: {
        id: populatedFeedback._id,
        submittedAt: populatedFeedback.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback. Please try again.'
    });
  }
});

// @desc    Get user's feedback
// @route   GET /api/feedback/my-feedback
// @access  Private
export const getMyFeedback = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type, status } = req.query;

  let query = { user: req.user._id };
  if (type) query.type = type;
  if (status) query.status = status;

  const feedback = await Feedback.find(query)
    .populate('property', 'title')
    .populate('booking')
    .populate('adminResponse.respondedBy', 'name')
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

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private
export const getFeedbackById = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id)
    .populate('user', 'name email')
    .populate('property', 'title')
    .populate('booking')
    .populate('adminResponse.respondedBy', 'name');

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }

  // Check if user is authorized to view this feedback
  if (
    feedback.user && 
    feedback.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this feedback'
    });
  }

  res.json({
    success: true,
    data: feedback,
  });
});

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private
export const updateFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }

  // Check if user owns this feedback
  if (feedback.user && feedback.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this feedback'
    });
  }

  // Only allow updates if feedback is still pending
  if (feedback.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Can only update pending feedback'
    });
  }

  const updatedFeedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('property', 'title');

  res.json({
    success: true,
    message: 'Feedback updated successfully',
    data: updatedFeedback,
  });
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
export const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: 'Feedback not found'
    });
  }

  // Check if user owns this feedback or is admin
  if (
    feedback.user && 
    feedback.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this feedback'
    });
  }

  await Feedback.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Feedback deleted successfully',
  });
});

// @desc    Get frontend testimonials (Public)
// @route   GET /api/feedback/testimonials
// @access  Public
export const getFrontendTestimonials = asyncHandler(async (req, res) => {
  try {
    const testimonials = await Feedback.find({
      showOnFrontend: true,
      status: { $in: ['resolved', 'reviewed'] },
      rating: { $gte: 4 } // Only show 4 and 5 star reviews
    })
      .populate('user', 'name')
      .select('rating message name user featured createdAt')
      .sort({ featured: -1, createdAt: -1 })
      .limit(20);

    // Format testimonials for frontend
    const formattedTestimonials = testimonials.map(testimonial => ({
      id: testimonial._id,
      name: testimonial.user?.name || testimonial.name,
      rating: testimonial.rating,
      text: testimonial.message,
      featured: testimonial.featured,
      date: testimonial.createdAt,
      // Default values for missing fields
      role: 'Verified User',
      location: 'Happy Customer',
      image: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(testimonial.user?.name || testimonial.name) + '&background=3B82F6&color=fff'
    }));

    res.json({
      success: true,
      data: formattedTestimonials,
      count: formattedTestimonials.length
    });

  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load testimonials',
      data: []
    });
  }
});