import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
  getAnalyticsData,
  trackAnalyticsEvent,
  getRealtimeAnalytics,
  getVisitorAnalytics,
  getPropertyAnalytics,
  getRecentListings,
  getAdminProfile,
  updateAdminProfile,
  updateAdminSettings,
  changeAdminPassword,
  getAdminActivityLog,
  getAllPropertiesAdmin,
  updatePropertyStatus,
  togglePropertyFeatured,
  deletePropertyAdmin,
  getPropertyDetailsAdmin,
  bulkUpdatePropertiesStatus,
  createPropertyAdmin,
  getAdminCmsPages,
  getAdminCmsPageById,
  createAdminCmsPage,
  updateAdminCmsPage,
  deleteAdminCmsPage,
} from '../controllers/adminController.js';

import {
  getAllFeedback,
  getFeedbackStats,
  updateFeedbackStatus,
  updateFeedbackAdmin,
  deleteFeedbackAdmin,
  getPublicFeedback
} from '../controllers/adminFeedbackController.js';

import { protect, roleAuth } from '../middlewares/auth.js';
import User from '../models/user.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Test route (no auth required)
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes working', status: 'success' });
});

// Public analytics tracking endpoint (no auth required)
router.post('/analytics/track', trackAnalyticsEvent);

// Public feedback endpoint (no auth required)
router.get('/feedback/public', getPublicFeedback);

// Admin login for testing (remove in production)
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

// ============ FEEDBACK MANAGEMENT ROUTES ============
router.get('/feedback', getAllFeedback);
router.get('/feedback/stats', getFeedbackStats);
router.put('/feedback/:id/status', updateFeedbackStatus);
router.put('/feedback/:id', updateFeedbackAdmin);   // use admin version
router.patch('/feedback/:id', updateFeedbackAdmin);
router.delete('/feedback/:id', deleteFeedbackAdmin);
// ============ END FEEDBACK ROUTES ============

// Admin profile management
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.put('/settings', updateAdminSettings);
router.put('/change-password', changeAdminPassword);
router.get('/activity-log', getAdminActivityLog);

// Property management
router.get('/properties', getAllPropertiesAdmin);
router.post('/properties', createPropertyAdmin);
router.get('/properties/:id', getPropertyDetailsAdmin);
router.put('/properties/:id/status', updatePropertyStatus);
router.put('/properties/:id/featured', togglePropertyFeatured);
router.delete('/properties/:id', deletePropertyAdmin);
router.put('/properties/bulk-status', bulkUpdatePropertiesStatus);

// CMS management
router.get('/cms/pages', getAdminCmsPages);
router.get('/cms/pages/:id', getAdminCmsPageById);
router.post('/cms/pages', createAdminCmsPage);
router.put('/cms/pages/:id', updateAdminCmsPage);
router.delete('/cms/pages/:id', deleteAdminCmsPage);

// Protected Analytics Routes
router.get('/analytics/realtime', getRealtimeAnalytics);
router.get('/analytics/visitors', getVisitorAnalytics);
router.get('/analytics/properties', getPropertyAnalytics);

export default router;
