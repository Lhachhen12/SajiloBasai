# 🏠 SajiloBasai - Property Rental Platform

> Nepal's premier platform for finding rooms, flats, and apartments

## 🌟 Overview

SajiloBasai is a comprehensive property rental platform built with modern web technologies. It connects property seekers with landlords directly, eliminating the need for middlemen and making the rental process simple, efficient, and transparent.

## 🚀 Features

### For Property Seekers (Buyers)

- 🔍 **Advanced Search**: Find properties with detailed filters
- ❤️ **Wishlist**: Save favorite properties for later
- 📅 **Booking System**: Request property visits and rentals
- 💬 **Direct Communication**: Contact landlords directly
- 📱 **Mobile Responsive**: Browse on any device
- 🎯 **Personalized Recommendations**: AI-powered property suggestions

### For Property Owners (Sellers)

- 📋 **Property Management**: List and manage multiple properties
- 📊 **Analytics Dashboard**: Track views and inquiries
- 💰 **Booking Management**: Handle rental requests
- 📸 **Media Upload**: Add photos and property details
- 📈 **Performance Insights**: Monitor listing performance

### For Administrators

- 👥 **User Management**: Manage users and permissions
- 📊 **Dashboard Analytics**: System-wide insights
- 🏢 **Property Oversight**: Monitor all listings
- 💬 **Feedback Management**: Handle user feedback
- 📝 **Content Management**: Manage static pages and blog

## 🛠 Technology Stack

### Frontend

- **React.js** - User interface library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Modern icon library
- **React Hot Toast** - Notification system

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### Security & Utilities

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Input Validation** - Data sanitization
- **Email Service** - Nodemailer integration

## 📁 Project Structure

```
SajiloBasai/
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── api/             # API integration
│   │   └── assets/          # Static assets
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── adminportal/             # Admin dashboard
│   └── ...                  # Admin-specific components
└── start-dev.bat           # Development startup script
```

## ⚡ Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SajiloBasai.git
cd SajiloBasai
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and other settings

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Ensure VITE_APP_API_URL points to your backend

# Start development server
npm run dev
```

### 4. Admin Portal Setup

```bash
cd adminportal

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Quick Start (Windows)

Double-click `start-dev.bat` to start both backend and frontend servers automatically.

## 🔧 Configuration

### Backend Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sajilobasai

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif
```

### Frontend Environment Variables

```env
# Backend API URL
VITE_APP_API_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=SajiloBasai
VITE_APP_VERSION=1.0.0
```

## 🗄 Database Models

### User Model

- Authentication and profile information
- Role-based access control (buyer/seller/admin)
- Profile settings and preferences

### Property Model

- Property details and specifications
- Images and media files
- Location and pricing information

### Booking Model

- Rental requests and confirmations
- Payment tracking and status
- Commission calculations

### Wishlist Model

- User favorite properties
- Quick access to saved listings

### CMS Models

- Static page content management
- Blog posts and articles
- SEO metadata

### Feedback Model

- User feedback and reviews
- Admin response system
- Priority and category tracking

## 🔐 Authentication & Security

### JWT Authentication

- Secure token-based authentication
- Role-based access control
- Automatic token refresh

### Security Features

- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Security headers with Helmet

### User Roles

- **Buyer**: Browse and book properties
- **Seller**: Manage property listings
- **Admin**: Full system administration

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/forgot-password  # Password reset request
POST /api/auth/reset-password/:token  # Password reset
```

### Property Endpoints

```
GET    /api/properties              # Get all properties
GET    /api/properties/featured     # Get featured properties
GET    /api/properties/:id          # Get specific property
POST   /api/properties              # Create property (seller)
PUT    /api/properties/:id          # Update property (seller)
DELETE /api/properties/:id          # Delete property (seller)
```

### Booking Endpoints

```
GET    /api/bookings        # Get user bookings
POST   /api/bookings        # Create booking
PUT    /api/bookings/:id/status  # Update booking status
POST   /api/bookings/:id/payment # Process payment
```

### Wishlist Endpoints

```
GET    /api/wishlist        # Get user wishlist
POST   /api/wishlist        # Add to wishlist
DELETE /api/wishlist/:id    # Remove from wishlist
```

## 🧪 Testing

### Sample User Accounts

After running the seed script, you can use these accounts:

**Admin Account**

- Email: `admin@sajilobasai.com`
- Password: `admin123`

**Buyer Account**

- Email: `john@example.com`
- Password: `password123`

**Seller Account**

- Email: `jane@example.com`
- Password: `password123`

### API Testing

Use tools like Postman or curl to test API endpoints:

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sajilobasai.com","password":"admin123"}'
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

1. Set up environment variables
2. Configure MongoDB Atlas
3. Deploy using Git or Docker

### Frontend Deployment (Vercel/Netlify)

1. Build the production version
2. Configure environment variables
3. Deploy from Git repository

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**

- Check MongoDB connection
- Verify environment variables
- Ensure correct Node.js version

**Frontend API errors**

- Verify backend is running
- Check CORS configuration
- Confirm API URL in .env

**Authentication issues**

- Clear browser localStorage
- Check JWT token expiration
- Verify user credentials

### Debug Mode

Set `NODE_ENV=development` and `VITE_APP_ENABLE_DEBUG=true` for detailed logging.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Aasish Tamang** - Project Lead & Backend Developer
- **Lhachhen Wanjyu Lama** - Frontend Developer & UI/UX
- **Aka Dorje Sherpa** - Full Stack Developer & DevOps

## 📞 Support

- **Email**: support@sajilobasai.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/SajiloBasai/issues)
- **Documentation**: See individual README files in backend/ and frontend/ directories

## 🎯 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced search with machine learning
- [ ] Real-time chat system
- [ ] Property verification system
- [ ] Payment gateway integration
- [ ] Multi-language support

---

**Made with ❤️ in Nepal for the global community**
