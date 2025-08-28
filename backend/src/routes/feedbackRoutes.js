import express from 'express';
import {
  createFeedback,
  getMyFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFrontendTestimonials,
} from '../controllers/feedbackController.js';
import { getPublicFeedback } from '../controllers/adminController.js';
import { protect, optionalAuth } from '../middlewares/auth.js';
import { validateFeedback } from '../middlewares/validation.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/public', getPublicFeedback);
router.get('/testimonials', getFrontendTestimonials); // Add this route for frontend

// Routes that can work with or without authentication
router.post('/submit', optionalAuth, validateFeedback, createFeedback); // Add /submit route
router.post('/', optionalAuth, validateFeedback, createFeedback); // Keep existing route

// Protected routes (require authentication)
router.get('/my-feedback', protect, getMyFeedback);
router.get('/:id', protect, getFeedbackById);
router.put('/:id', protect, updateFeedback);
router.delete('/:id', protect, deleteFeedback);

export default router;