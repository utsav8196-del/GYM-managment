const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/env');

const signToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

const createSendToken = (user, statusCode, res) => {
  let token;
  try {
    token = signToken(user._id);
  } catch (err) {
    console.error('JWT signing error:', err.message || err);
    throw err;
  }

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: userWithoutPassword },
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // basic validation for clear errors
  if (!name || !email || !password) {
    return next(new AppError('Name, email and password are required', 400));
  }

  // Only admins can create other admins, default to staff
  const newRole = req.user && req.user.role === 'admin' ? role : 'staff';

  // log incoming data for debugging
  console.log('Register request body:', { name, email, role: newRole });

  const user = await User.create({ name, email, password, role: newRole });

  // token creation may fail if JWT_SECRET is missing
  try {
    createSendToken(user, 201, res);
  } catch (err) {
    console.error('Error sending token during registration:', err);
    next(err);
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.getProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const allowedFields = [
    'name',
    'email',
    'phone',
    'addressLine1',
    'addressLine2',
    'city',
    'state',
    'postalCode',
    'country',
    'dateOfBirth',
    'gender',
    'bio',
  ];

  const blockedFields = ['password', 'role'];
  const providedFields = Object.keys(req.body || {});

  if (providedFields.length === 0) {
    return next(new AppError('Please provide at least one field to update', 400));
  }

  if (providedFields.some((field) => blockedFields.includes(field))) {
    return next(new AppError('Use dedicated routes to update password or role', 400));
  }

  const invalidFields = providedFields.filter((field) => !allowedFields.includes(field));
  if (invalidFields.length) {
    return next(new AppError(`Invalid fields: ${invalidFields.join(', ')}`, 400));
  }

  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'name')) {
    if (typeof req.body.name !== 'string' || !req.body.name.trim()) {
      return next(new AppError('Name is required', 400));
    }
    user.name = req.body.name.trim();
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'email')) {
    if (typeof req.body.email !== 'string' || !req.body.email.trim()) {
      return next(new AppError('Email is required', 400));
    }
    user.email = req.body.email.trim().toLowerCase();
  }

  const optionalStringFields = ['phone', 'addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country', 'bio'];
  optionalStringFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      const value = req.body[field];
      if (value === null || value === undefined || value === '') {
        user[field] = undefined;
      } else if (typeof value === 'string') {
        user[field] = value.trim();
      }
    }
  });

  if (Object.prototype.hasOwnProperty.call(req.body, 'gender')) {
    const value = req.body.gender;
    if (value === null || value === undefined || value === '') {
      user.gender = undefined;
    } else {
      user.gender = value;
    }
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'dateOfBirth')) {
    const value = req.body.dateOfBirth;
    if (!value) {
      user.dateOfBirth = undefined;
    } else {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) {
        return next(new AppError('Invalid date of birth', 400));
      }
      user.dateOfBirth = parsed;
    }
  }

  await user.save();

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }
  user.password = newPassword;
  await user.save();
  createSendToken(user, 200, res);
});
