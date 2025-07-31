import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required'],
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer reference is required'],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller reference is required'],
  },
  contactInfo: {
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      maxLength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      maxLength: [15, 'Phone cannot exceed 15 characters'],
    },
  },
  bookingDetails: {
    numberOfPeople: {
      type: Number,
      required: [true, 'Number of people is required'],
      min: [1, 'At least 1 person required'],
    },
    hasPets: {
      type: Boolean,
      default: false,
    },
    useType: {
      type: String,
      enum: ['personal', 'family', 'business'],
      required: [true, 'Use type is required'],
    },
    message: {
      type: String,
      maxLength: [500, 'Message cannot exceed 500 characters'],
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    duration: {
      type: Number, // in months
      required: [true, 'Duration is required'],
      min: [1, 'Minimum duration is 1 month'],
    },
  },
  payment: {
    method: {
      type: String,
      enum: ['online', 'cash', 'bank_transfer'],
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    transactionId: String,
    paymentDate: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
    default: 'pending',
  },
  commission: {
    type: Number,
    default: 0,
  },
  notes: [
    {
      content: String,
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // Calculate commission (5% of payment amount)
  if (this.payment && this.payment.amount) {
    this.commission = this.payment.amount * 0.05;
  }

  next();
});

// Index for efficient queries
bookingSchema.index({ buyer: 1, status: 1 });
bookingSchema.index({ seller: 1, status: 1 });
bookingSchema.index({ property: 1, status: 1 });
bookingSchema.index({ createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
