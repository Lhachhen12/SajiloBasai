import express from 'express';
import { body, param } from 'express-validator';

const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['buyer', 'seller', 'main_admin'])
    .withMessage('Role must be buyer, seller, or main_admin'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('businessName')
    .if(body('role').equals('seller'))
    .notEmpty()
    .withMessage('Business name is required for sellers'),
  body('businessLicense')
    .if(body('role').equals('seller'))
    .notEmpty()
    .withMessage('Business license is required for sellers'),
  body('termsAccepted')
    .equals('true')
    .withMessage('You must accept the terms and conditions')
];

const router = express.Router();
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', emailValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.get('/verify-email/:token', verifyEmail);