// backend/routes/sellerChatRoute.js
import express from 'express';
import { protect } from '../middlewares/auth.js';
import { 
  getSellerChatRooms, 
  getSellerPropertyChats, 
  getSellerChatMessages, 
  sendSellerMessage, 
  markSellerMessagesAsRead,
  getSellerUnreadCount 
} from '../controllers/sellerChatController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all seller chat rooms
router.get('/rooms', getSellerChatRooms);

// Get seller property chats
router.get('/property-chats', getSellerPropertyChats);

// Get messages for a seller chat room
router.get('/messages/:roomId', getSellerChatMessages);

// Send message as seller
router.post('/message', sendSellerMessage);

// Mark messages as read for seller
router.put('/messages/read', markSellerMessagesAsRead);

// Get seller's unread message count
router.get('/unread-count', getSellerUnreadCount);

export default router;