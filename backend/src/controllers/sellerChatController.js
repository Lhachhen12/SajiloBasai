// backend/controllers/sellerChatController.js
import { ChatRoom, Message } from '../models/chat.js';
import Property from '../models/Property.js';
import User from '../models/user.js';

// Get all seller chat rooms
export const getSellerChatRooms = async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Seller only.' });
    }
    
    // Get all chat rooms where seller is a participant
    const chatRooms = await ChatRoom.find({
      participants: user._id,
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

    res.status(200).json(chatRooms);
  } catch (error) {
    console.error('Error fetching seller chat rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get seller's property chats
export const getSellerPropertyChats = async (req, res) => {
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
    console.error('Error fetching seller property chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages for seller chat room
export const getSellerChatMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const sellerId = req.user.id;
    const user = await User.findById(sellerId);

    if (user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Seller only.' });
    }

    // Verify seller is participant in this room
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom || !chatRoom.participants.some(p => p.toString() === sellerId.toString())) {
      return res.status(403).json({ message: 'Access denied to this chat room' });
    }

    const messages = await Message.find({ 
      chatRoom: roomId 
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'name profile.avatar role')
    .populate('receiverId', 'name profile.avatar role');

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching seller messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send seller message
export const sendSellerMessage = async (req, res) => {
  try {
    const { text, receiverId, roomId, propertyId } = req.body;
    const senderId = req.user.id;

    // Validate required fields
    if (!text || !receiverId || !roomId) {
      return res.status(400).json({ message: 'Text, receiverId, and roomId are required' });
    }

    // Verify seller is participant in this room
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
    console.error('Error sending seller message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark seller messages as read
export const markSellerMessagesAsRead = async (req, res) => {
  try {
    const { roomId } = req.body;
    const sellerId = req.user.id;

    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }

    // Verify seller is participant in this room
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom || !chatRoom.participants.some(p => p.toString() === sellerId.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark messages as read
    await Message.updateMany(
      {
        receiverId: sellerId,
        chatRoom: roomId,
        read: false
      },
      { read: true }
    );

    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking seller messages as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get seller's unread message count
export const getSellerUnreadCount = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const unreadCount = await Message.countDocuments({
      receiverId: sellerId,
      read: false
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Error fetching seller unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};