import { ChatRoom, Message } from '../models/chat.js';
import User from '../models/user.js';
import Property from '../models/Property.js';

// Get all chat rooms for a seller
export const getSellerChatRooms = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Verify user is a seller
    const user = await User.findById(sellerId);
    if (user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Seller only.' });
    }

    // Get all chat rooms where seller is a participant
    const chatRooms = await ChatRoom.find({
      participants: sellerId,
      $or: [
        { propertyId: { $exists: true } }, // Property chats
        { isAdminChat: true } // Admin chats
      ]
    })
    .populate('participants', 'name profile.avatar role')
    .populate('propertyId', 'title images')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.status(200).json(chatRooms);
  } catch (error) {
    console.error('Error fetching seller chat rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages for a seller chat room
export const getSellerChatMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const sellerId = req.user.id;

    // Verify user is a seller
    const user = await User.findById(sellerId);
    if (user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Seller only.' });
    }

    // Verify seller is a participant in the chat room
    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom || !chatRoom.participants.includes(sellerId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ 
      chatRoom: roomId
    }).sort({ createdAt: 1 }).populate('senderId', 'name profile.avatar role');

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching seller chat messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send message as seller
export const sendSellerMessage = async (req, res) => {
  try {
    const { text, receiverId, roomId } = req.body;
    const senderId = req.user.id;

    // Verify user is a seller
    const seller = await User.findById(senderId);
    if (seller.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Seller only.' });
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
      { lastMessage: message._id }
    );

    // Populate sender info before sending response
    await message.populate('senderId', 'name profile.avatar role');

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending seller message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get property chats for a seller
export const getSellerPropertyChats = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Verify user is a seller
    const user = await User.findById(sellerId);
    if (user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Seller only.' });
    }

    // Get properties owned by the seller
    const properties = await Property.find({ sellerId }).select('_id title');

    // Get chat rooms for these properties
    const propertyChats = await ChatRoom.find({
      propertyId: { $in: properties.map(p => p._id) }
    })
    .populate('participants', 'name profile.avatar role')
    .populate('propertyId', 'title images')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.status(200).json(propertyChats);
  } catch (error) {
    console.error('Error fetching seller property chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark messages as read for seller
export const markSellerMessagesAsRead = async (req, res) => {
  try {
    const { roomId } = req.body;
    const sellerId = req.user.id;

    // Verify user is a seller
    const user = await User.findById(sellerId);
    if (user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Seller only.' });
    }

    const chatRoom = await ChatRoom.findById(roomId);
    if (!chatRoom || !chatRoom.participants.includes(sellerId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Message.updateMany(
      {
        receiverId: sellerId,
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