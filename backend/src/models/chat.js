// backend/models/chat.js
import mongoose from 'mongoose';

// Chat Room Schema
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
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Message Schema
const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
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
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
chatRoomSchema.index({ participants: 1, propertyId: 1 });
chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ propertyId: 1 });
chatRoomSchema.index({ updatedAt: -1 });
chatRoomSchema.index({ isAdminChat: 1, participants: 1 });

messageSchema.index({ chatRoom: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, read: 1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ propertyId: 1 });

// Pre-save middleware for updating timestamps
chatRoomSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

export const Message = mongoose.model('Message', messageSchema);
export const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);