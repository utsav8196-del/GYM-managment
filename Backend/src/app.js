const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const config = require('./config/env');
const errorHandler = require('./middlewares/errorMiddleware');
const AppError = require('./utils/AppError');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const memberRoutes = require('./routes/memberRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const planRoutes = require('./routes/planRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const classRoutes = require('./routes/classRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const courseRoutes = require('./routes/courseRoutes');
const blogRoutes = require('./routes/blogRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();


app.options("*", cors());
// Security middleware
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? '*' : 'your-frontend-domain',
    credentials: true,
}));

// Rate limiting
const isDev = process.env.NODE_ENV === 'development';
const limiter = rateLimit({
    max: isDev ? 5000 : 100,
    windowMs: isDev ? 60 * 1000 : 60 * 60 * 1000, // 1 minute in dev, 1 hour in production
    standardHeaders: true,
    legacyHeaders: false,
    // In local development, do not throttle read-only dashboard requests.
    skip: (req) => isDev && req.method === 'GET',
    message: isDev
        ? 'Too many write requests. Please wait a minute and retry.'
        : 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);
app.use('/api/v1/members', memberRoutes);
// app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/memberships', membershipRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/reports', reportRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// 404 handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
