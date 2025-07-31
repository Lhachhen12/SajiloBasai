import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
  getAnalyticsData,
  getAllFeedback,
  updateFeedbackStatus,
  getRecentListings,
  getAdminProfile,
  updateAdminProfile,
  getAllPropertiesAdmin,
  updatePropertyStatus,
  togglePropertyFeatured,
  deletePropertyAdmin,
  getPropertyDetailsAdmin,
  bulkUpdatePropertiesStatus,
  createPropertyAdmin,
} from '../controllers/adminController.js';
import { protect, roleAuth } from '../middlewares/auth.js';
import User from '../models/user.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin login for testing - remove this in production
router.post(
  '/test-login',
  asyncHandler(async (req, res) => {
    const admin = await User.findOne({ email: 'admin@sajilobasai.com' });
    if (admin) {
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
      });

      res.json({
        success: true,
        token,
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Admin not found' });
    }
  })
);

// All other admin routes require authentication and admin role
router.use(protect);
router.use(roleAuth('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Dashboard and analytics
router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalyticsData);
router.get('/recent-listings', getRecentListings);

// Feedback management
router.get('/feedback', getAllFeedback);
router.put('/feedback/:id/status', updateFeedbackStatus);

// Admin profile management
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

// Property management
router.get('/properties', getAllPropertiesAdmin);
router.post('/properties', createPropertyAdmin);
router.get('/properties/:id', getPropertyDetailsAdmin);
router.put('/properties/:id/status', updatePropertyStatus);
router.put('/properties/:id/featured', togglePropertyFeatured);
router.delete('/properties/:id', deletePropertyAdmin);
router.put('/properties/bulk-status', bulkUpdatePropertiesStatus);

export default router;
