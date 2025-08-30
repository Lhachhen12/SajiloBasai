// backend/controllers/adminChatController.js
import { ChatRoom, Message } from '../models/chat.js';
import Property from '../models/Property.js';
import User from '../models/user.js';

// Get all chat rooms for admin (with sellers)
export const getAdminChatRooms = async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    // Get all chat rooms where admin is a participant
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
    console.error('Error fetching admin chat rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get or create admin-seller chat room
export const getOrCreateAdminSellerChat = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { sellerId } = req.body;

    // Verify user is admin
    const admin = await User.findById(adminId);
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Verify seller exists
    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Check if chat room already exists
    let chatRoom = await ChatRoom.findOne({
      participants: { $all: [adminId, sellerId] },
      isAdminChat: true
    })
    .populate('participants', 'name profile.avatar role')
    .populate('lastMessage');

    if (!chatRoom) {
      // Create a special admin-seller chat room (no property association)
      chatRoom = new ChatRoom({
        participants: [adminId, sellerId],
        isAdminChat: true
      });

      await chatRoom.save();
      await chatRoom.populate('participants', 'name profile.avatar role');
    }
    
    res.status(200).json(chatRoom);
  } catch (error) {
    console.error('Error creating admin-seller chat:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages for admin chat room
export const getAdminChatMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    // Verify user is admin
    const user = await User.findById(userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Verify admin is a participant in the chat room
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom || !chatRoom.participants.some(p => p.toString() === userId.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ 
      chatRoom: roomId
    }).sort({ createdAt: 1 }).populate('senderId', 'name profile.avatar role');

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching admin chat messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send message as admin
export const sendAdminMessage = async (req, res) => {
  try {
    const { text, receiverId, roomId } = req.body;
    const senderId = req.user.id;

    // Verify user is admin
    const admin = await User.findById(senderId);
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Create new message
    const message = new Message({
      text,
      senderId,
      receiverId,
      chatRoom: roomId
    });

    await message.save();

    // Update chat room's last message
    await ChatRoom.findByIdAndUpdate(
      roomId,
      { 
        lastMessage: message._id,
        updatedAt: new Date()
      }
    );

    // Populate sender info before sending response
    await message.populate('senderId', 'name profile.avatar role');

    // Send real-time notification via WebSocket
    const wsService = req.app.locals.wsService;
    if (wsService) {
      wsService.notifyNewMessage(roomId, message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending admin message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all sellers for admin chat
export const getSellersForAdmin = async (req, res) => {
  try {
    const userId = req.user.id;

    // Verify user is admin
    const user = await User.findById(userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get all sellers
    const sellers = await User.find({ role: 'seller' })
      .select('name email profile.avatar')
      .sort({ name: 1 });

    res.status(200).json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};