import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingsByBuyer,
  getBookingsBySeller,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  processPayment,
  addBookingNote,
  getBookingStats,
  deleteBookingAdmin,
  bulkUpdateBookingStatus,
  getBookingDetailsAdmin,
  updatePaymentStatusAdmin,
  createBookingAdmin,
} from '../controllers/bookingController.js';
import { protect, roleAuth } from '../middlewares/auth.js';
import { validateBooking } from '../middlewares/validation.js';

const router = express.Router();

// Buyer routes
router.post('/', protect, roleAuth('buyer'), validateBooking, createBooking);
router.get('/my-bookings', protect, roleAuth('buyer'), getMyBookings);
router.put('/:id/payment', protect, processPayment);

// Seller routes
router.get('/seller/:sellerId', protect, getBookingsBySeller);
router.put('/:id/status', protect, updateBookingStatus);

// Buyer routes
router.get('/buyer/:buyerId', protect, getBookingsByBuyer);

// Common routes (buyer, seller, admin)
router.get('/:id', protect, getBookingById);
router.post('/:id/notes', protect, addBookingNote);

// Admin routes
router.post('/admin/create', protect, roleAuth('admin'), createBookingAdmin);
router.get('/', protect, roleAuth('admin'), getAllBookings);
router.get('/stats/overview', protect, roleAuth('admin'), getBookingStats);
router.delete('/:id', protect, roleAuth('admin'), deleteBookingAdmin);
router.put('/bulk-status', protect, roleAuth('admin'), bulkUpdateBookingStatus);
router.get('/:id/details', protect, roleAuth('admin'), getBookingDetailsAdmin);
router.put(
  '/:id/payment-status',
  protect,
  roleAuth('admin'),
  updatePaymentStatusAdmin
);

export default router;
