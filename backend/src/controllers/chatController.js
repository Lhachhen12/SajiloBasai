// backend/controllers/chatController.js
import { ChatRoom, Message } from '../models/chat.js';
import User from '../models/user.js';
import Property from '../models/Property.js';

// Get or create chat room (works for all users)
export const getOrCreateChatRoom = async (req, res) => {
  try {
    const { propertyId, sellerId, buyerId, isAdminChat = false } = req.body;
    const currentUserId = req.user.id;

    let participants;
    
    if (isAdminChat) {
      // For admin chats, include admin in participants
      participants = [currentUserId, sellerId || buyerId].filter(Boolean).sort();
    } else {
      // For property chats, ensure we have both buyer and seller
      const finalBuyerId = buyerId || (req.user.role === 'buyer' ? currentUserId : null);
      const finalSellerId = sellerId || (req.user.role === 'seller' ? currentUserId : null);
      
      if (!finalBuyerId || !finalSellerId) {
        return res.status(400).json({ message: 'Both buyer and seller required for property chat' });
      }
      
      participants = [finalBuyerId, finalSellerId].sort();
    }

    // Check if chat room already exists
    let chatRoom = await ChatRoom.findOne({
      participants,
      ...(propertyId && { propertyId }),
      ...(isAdminChat && { isAdminChat: true })
    })
    .populate('participants', 'name profile.avatar role')
    .populate('propertyId', 'title images')
    .populate('lastMessage');

    if (!chatRoom) {
      // Create new chat room
      chatRoom = new ChatRoom({
        participants,
        ...(propertyId && { propertyId }),
        isAdminChat
      });
      await chatRoom.save();
      
      // Populate after saving
      await chatRoom.populate('participants', 'name profile.avatar role');
      await chatRoom.populate('propertyId', 'title images');
    }

    res.status(200).json(chatRoom);
  } catch (error) {
    console.error('Error getting chat room:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all chat rooms for current user
export const getChatRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let query = { participants: userId };

    // Filter based on user role if needed
    if (req.query.type === 'property') {
      query.isAdminChat = { $ne: true };
      query.propertyId = { $exists: true };
    } else if (req.query.type === 'admin') {
      query.isAdminChat = true;
    }

    const chatRooms = await ChatRoom.find(query)
      .populate('participants', 'name profile.avatar role')
      .populate('propertyId', 'title images')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'senderId',
          select: 'name profile.avatar role'
        }
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chatRooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages for a chat room
export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    // Verify user is a participant in the chat room
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom || !chatRoom.participants.some(p => p.toString() === userId.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ 
      chatRoom: roomId 
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'name profile.avatar role')
    .populate('receiverId', 'name profile.avatar role');

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { text, receiverId, roomId, propertyId } = req.body;
    const senderId = req.user.id;

    // Validate required fields
    if (!text || !receiverId || !roomId) {
      return res.status(400).json({ message: 'Text, receiverId, and roomId are required' });
    }

    // Verify chat room exists and user is participant
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom || !chatRoom.participants.some(p => p.toString() === senderId.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create new message
    const message = new Message({
      text,
      senderId,
      receiverId,
      chatRoom: roomId,
      ...(propertyId && { propertyId })
    });

    await message.save();

    // Update chat room's last message and timestamp
    await ChatRoom.findByIdAndUpdate(
      roomId,
      { 
        lastMessage: message._id,
        updatedAt: new Date()
      }
    );

    // Populate sender info before sending response
    await message.populate('senderId', 'name profile.avatar role');
    await message.populate('receiverId', 'name profile.avatar role');

    // Send real-time notification via WebSocket
    const wsService = req.app.locals.wsService;
    if (wsService) {
      wsService.notifyNewMessage(roomId, message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.id;

    // Verify user is participant in chat room
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom || !chatRoom.participants.some(p => p.toString() === userId.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark all unread messages in this room as read for current user
    await Message.updateMany(
      {
        receiverId: userId,
        chatRoom: roomId,
        read: false
      },
      { read: true }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get unread message count for user
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.countDocuments({
      receiverId: userId,
      read: false
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get property chats for sellers (specific endpoint for sellers)
export const getPropertyChats = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const user = await User.findById(sellerId);

    if (user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Seller only.' });
    }

    // Get properties owned by the seller
    const properties = await Property.find({ sellerId }).select('_id title');

    // Get chat rooms for these properties
    const propertyChats = await ChatRoom.find({
      propertyId: { $in: properties.map(p => p._id) },
      participants: sellerId
    })
    .populate('participants', 'name profile.avatar role')
    .populate('propertyId', 'title images')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'senderId',
        select: 'name profile.avatar role'
      }
    })
    .sort({ updatedAt: -1 });

    res.status(200).json(propertyChats);
  } catch (error) {
    console.error('Error fetching property chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};