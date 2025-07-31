import express from 'express';
import {
  getAllProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesBySeller,
  getMyProperties,
  searchProperties,
  toggleFeatured,
} from '../controllers/propertyController.js';
import { protect, roleAuth } from '../middlewares/auth.js';
import { validateProperty } from '../middlewares/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/featured', getFeaturedProperties);
router.get('/search', searchProperties);
router.get('/seller/:sellerId', getPropertiesBySeller);
router.get('/:id', getPropertyById);

// Private routes
router.post('/', protect, roleAuth('seller', 'admin'), createProperty);
router.get('/my/properties', protect, roleAuth('seller'), getMyProperties);

// Property owner or admin routes
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

// Admin only routes
router.put('/:id/featured', protect, roleAuth('admin'), toggleFeatured);

export default router;
