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
  superSearch,
  // NEW: Location-based functions
  getNearbyProperties,
  getLocationBasedRecommendations,
  detectUserLocation,
  geocodePropertyAddress,
  createPropertyWithLocation
} from '../controllers/propertyController.js';
import { protect, roleAuth } from '../middlewares/auth.js';
import { validateProperty } from '../middlewares/validation.js';
import { trackPageView } from '../middlewares/analytics.js';

const router = express.Router();

// Public routes
router.get('/', trackPageView, getAllProperties);
router.get('/featured', trackPageView, getFeaturedProperties);
router.get('/search', trackPageView, searchProperties);
router.get('/seller/:sellerId', trackPageView, getPropertiesBySeller);
router.get('/:id', trackPageView, getPropertyById);

// Super search route (existing)
router.post('/super-search', superSearch);

// NEW: Location-based routes (Public)
router.post('/nearby', getNearbyProperties);
router.post('/recommendations', getLocationBasedRecommendations);
router.get('/detect-location', detectUserLocation);

// NEW: Geocoding route (Protected)
router.post('/geocode', protect, geocodePropertyAddress);

// Private routes
router.post('/', protect, roleAuth('seller', 'admin'), createPropertyWithLocation);
router.get('/my/properties', protect, roleAuth('seller'), getMyProperties);

// Property owner or admin routes
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

// Admin only routes
router.put('/:id/featured', protect, roleAuth('admin'), toggleFeatured);

export default router;