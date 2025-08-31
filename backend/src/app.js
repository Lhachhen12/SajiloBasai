// backend/app.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import WebSocketService from './utils/websocketService.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import esewaRoute from "./routes/esewaRoute.js"
import chatRoutes from './routes/chatRoute.js';
import adminChatRoutes from './routes/adminChatRoute.js';
import sellerChatRoutes from './routes/sellerChatRoute.js';

// Import middlewares
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket service
const wsService = new WebSocketService(server);

// Make WebSocket service available to all routes
app.locals.wsService = wsService;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:4100', // Admin portal
      'http://localhost:3000',
      'https://adminsajilobasai.vercel.app',
      // Alternative frontend port
    ],
    credentials: true,
  })
);

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again later.',
//   },
// });

// app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SajiloBasai API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    websocket: wsService ? 'Connected' : 'Disconnected'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin/chat', adminChatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/payments', esewaRoute);
app.use('/api/chat', chatRoutes);
app.use('/api/seller/chat', sellerChatRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const serverInstance = server.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  console.log(`📡 WebSocket service initialized`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  serverInstance.close(() => {
    process.exit(1);
  });
});

export default app;