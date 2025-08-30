import { body, validationResult } from 'express-validator';

// Validate profile update
export const validateUpdateProfile = [
  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name cannot contain numbers or special characters'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  body('profile.phone')
    .optional()
    .matches(/^[\+]?[\d\s\-\(\)]+$/)
    .withMessage('Please enter a valid phone number'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

// Validate password change
export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

// Helper function to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation
export const validateRegister = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  body('role')
    .optional()
    .isIn(['buyer', 'seller'])
    .withMessage('Role must be either buyer or seller'),

  handleValidationErrors,
];

// User login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];

// Property validation
export const validateProperty = [
  body('title')
    .notEmpty()
    .withMessage('Property title is required')
    .isLength({ min: 10, max: 100 })
    .withMessage('Title must be between 10 and 100 characters'),

  body('description')
    .notEmpty()
    .withMessage('Property description is required')
    .isLength({ min: 50, max: 1000 })
    .withMessage('Description must be between 50 and 1000 characters'),

  body('type')
    .isIn(['room', 'flat', 'apartment', 'house'])
    .withMessage('Invalid property type'),

  body('price')
    .isFloat({ min: 1 })
    .withMessage('Price must be a positive number'),

  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 50 })
    .withMessage('Location cannot exceed 50 characters'),

  body('area')
    .isFloat({ min: 1 })
    .withMessage('Area must be a positive number'),

  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),

  handleValidationErrors,
];

// Booking validation
export const validateBooking = [
  body('propertyId').isMongoId().withMessage('Invalid property ID'),

  body('contactInfo.name')
    .notEmpty()
    .withMessage('Contact name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),

  body('contactInfo.email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),

  body('contactInfo.phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('bookingDetails.numberOfPeople')
    .isInt({ min: 1 })
    .withMessage('Number of people must be at least 1'),

  body('bookingDetails.useType')
    .isIn(['personal', 'family', 'business'])
    .withMessage('Invalid use type'),

  body('bookingDetails.checkInDate')
    .isISO8601()
    .withMessage('Valid check-in date is required')
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(value) < today) {
        throw new Error('Check-in date cannot be in the past');
      }
      return true;
    }),

  body('bookingDetails.checkOutDate')
    .optional()
    .isISO8601()
    .withMessage('Valid check-out date is required')
    .custom((value, { req }) => {
      if (value && req.body.bookingDetails?.checkInDate) {
        if (new Date(value) <= new Date(req.body.bookingDetails.checkInDate)) {
          throw new Error('Check-out date must be after check-in date');
        }
      }
      return true;
    }),

  body('bookingDetails.duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 month'),

  body('paymentMethod')
    .isIn(['online', 'cash', 'bank_transfer'])
    .withMessage('Invalid payment method'),

  handleValidationErrors,
];

// Feedback validation

export const validateFeedback = [
  body('type')
    .isIn(['property_review', 'platform_feedback', 'bug_report', 'suggestion', 'testimonial', 'general'])
    .withMessage('Invalid feedback type'),

  body('subject')
    .optional() // Made optional
    .isLength({ max: 100 })
    .withMessage('Subject cannot exceed 100 characters'),

  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('property').optional().isMongoId().withMessage('Invalid property ID'),

  handleValidationErrors,
];

// Contact form validation
export const validateContact = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(\+977)?[9][6-9]\d{8}$|^(\+977)?[01]\d{7}$/)
    .withMessage('Please provide a valid Nepali phone number')
    .trim(),

  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Subject must be between 3 and 200 characters')
    .trim(),

  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
    .trim(),

  body('category')
    .optional()
    .isIn([
      'General Inquiry',
      'Property Listing',
      'Technical Support',
      'Partnership',
      'Complaint',
      'Other',
    ])
    .withMessage('Invalid category'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Urgent'])
    .withMessage('Invalid priority'),

  handleValidationErrors,
];

// Report validation
export const validateReport = [
  body('property')
    .notEmpty()
    .withMessage('Property is required')
    .isMongoId()
    .withMessage('Invalid property ID'),

  body('reason')
    .notEmpty()
    .withMessage('Report reason is required')
    .isIn([
      'Inappropriate Content',
      'Fake Listing',
      'Duplicate Listing',
      'Spam',
      'Incorrect Information',
      'Privacy Violation',
      'Scam/Fraud',
      'Other',
    ])
    .withMessage('Invalid report reason'),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters')
    .trim(),

  body('evidence')
    .optional()
    .isArray()
    .withMessage('Evidence must be an array'),

  body('evidence.*')
    .optional()
    .isURL()
    .withMessage('Each evidence item must be a valid URL'),

  handleValidationErrors,
];
