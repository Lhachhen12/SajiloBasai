import mongoose from 'mongoose';

// In models/Chat.js
const chatRoomSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: function() {
      return !this.isAdminChat;
    }
  },
  isAdminChat: {
    type: Boolean,
    default: false
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxLength: 1000
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  },
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying
chatRoomSchema.index({ participants: 1, propertyId: 1 }, { unique: true });
messageSchema.index({ senderId: 1, receiverId: 1, propertyId: 1 });

export const Message = mongoose.model('Message', messageSchema);
export const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);