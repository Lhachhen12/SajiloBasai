import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.name; // Required if no name provided (for anonymous feedback)
    }
  },
  name: {
    type: String,
    required: function() {
      return !this.user; // Required if no user ID provided (for anonymous feedback)
    },
    trim: true,
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: function() {
      return !this.user; // Required if no user ID provided (for anonymous feedback)
    },
    trim: true,
    lowercase: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  type: {
    type: String,
    enum: ['property_review', 'platform_feedback', 'bug_report', 'suggestion', 'testimonial', 'general'],
    default: 'general'
  },
  subject: {
    type: String,
    maxLength: [100, 'Subject cannot exceed 100 characters'],
  },
  message: {
    type: String,
    required: [true, 'Feedback message is required'],
    maxLength: [1000, 'Message cannot exceed 1000 characters'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending',
  },
  adminResponse: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    respondedAt: Date,
  },
  attachments: [String], // URLs to attached files
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  showOnFrontend: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ['general', 'bug_report', 'feature_request', 'testimonial'],
    default: 'general'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
feedbackSchema.index({ user: 1, type: 1 });
feedbackSchema.index({ property: 1, type: 1 });
feedbackSchema.index({ status: 1, priority: 1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ showOnFrontend: 1, status: 1 });
feedbackSchema.index({ featured: 1 });
feedbackSchema.index({ createdAt: -1 });

// Virtual for getting user info
feedbackSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are included in JSON output
feedbackSchema.set('toJSON', { virtuals: true });
// Add pagination plugin
feedbackSchema.plugin(mongoosePaginate);

export default mongoose.model('Feedback', feedbackSchema);