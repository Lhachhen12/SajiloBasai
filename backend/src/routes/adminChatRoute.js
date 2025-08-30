// backend/routes/adminChatRoute.js
import express from 'express';
import { protect } from '../middlewares/auth.js';
import { 
  getAdminChatRooms, 
  getOrCreateAdminSellerChat, 
  getAdminChatMessages, 
  sendAdminMessage, 
  getSellersForAdmin 
} from '../controllers/adminChatController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all admin chat rooms
router.get('/rooms', getAdminChatRooms);

// Get all sellers for admin chat
router.get('/sellers', getSellersForAdmin);

// Get or create admin-seller chat
router.post('/room', getOrCreateAdminSellerChat);

// Get messages for admin chat room
router.get('/messages/:roomId', getAdminChatMessages);

// Send message as admin
router.post('/message', sendAdminMessage);

export default router;