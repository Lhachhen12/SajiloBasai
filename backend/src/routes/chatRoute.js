// backend/routes/chatRoute.js
import express from 'express';
import { protect } from '../middlewares/auth.js';
import { 
  getChatRooms, 
  getMessages, 
  getOrCreateChatRoom, 
  markMessagesAsRead, 
  sendMessage,
  getUnreadCount,
  getPropertyChats
} from '../controllers/chatController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get or create chat room
router.post('/room', getOrCreateChatRoom);

// Get messages for a chat room
router.get('/rooms/:roomId/messages', getMessages);

// Send a message
router.post('/message', sendMessage);

// Get user's chat rooms
router.get('/rooms', getChatRooms);

// Get property chats (seller-specific)
router.get('/property-chats', getPropertyChats);

// Get unread message count
router.get('/unread-count', getUnreadCount);

// Mark messages as read
router.post('/messages/read', markMessagesAsRead);

export default router;