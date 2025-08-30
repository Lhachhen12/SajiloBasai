import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  toggleUserStatus,
} from '../controllers/user.js';
import { protect, roleAuth } from '../middlewares/auth.js';
import { validateUpdateProfile } from '../middlewares/validation.js'; // You might want to create this

const router = express.Router();

// Protected user routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateUpdateProfile, updateProfile); // Add validation

// Role-specific profile routes
router.get('/buyer/profile', protect, roleAuth('buyer'), getProfile);
router.get('/seller/profile', protect, roleAuth('seller'), getProfile);

// Add role-specific routes
router.get('/buyer/profile', protect, roleAuth('buyer'), getProfile);
router.get('/seller/profile', protect, roleAuth('seller'), getProfile);

// Admin only routes
router.get('/', protect, roleAuth('admin'), getAllUsers);
router.patch(
  '/:userId/toggle-status',
  protect,
  roleAuth('admin'),
  toggleUserStatus
);

export default router;