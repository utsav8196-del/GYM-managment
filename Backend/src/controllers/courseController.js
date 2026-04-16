const Course = require('../models/Course');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Public: get all courses
exports.getAllCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find().sort('order');
  res.status(200).json({ status: 'success', data: courses });
});

// Public: get single course
exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  res.status(200).json({ status: 'success', data: course });
});

// Admin: create (with image upload)
exports.createCourse = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.path;

  // Handle prices object
  if (req.body.lowerPrice !== undefined || req.body.mediumPrice !== undefined || req.body.higherPrice !== undefined) {
    req.body.prices = {
      lower: Number(req.body.lowerPrice),
      medium: Number(req.body.mediumPrice),
      higher: Number(req.body.higherPrice),
    };
    delete req.body.lowerPrice;
    delete req.body.mediumPrice;
    delete req.body.higherPrice;
  }

  // Validate prices
  if (req.body.prices) {
    const { lower, medium, higher } = req.body.prices;
    if (!Number.isFinite(lower) || lower <= 0 ||
        !Number.isFinite(medium) || medium <= 0 ||
        !Number.isFinite(higher) || higher <= 0) {
      return next(new AppError('All prices must be numbers greater than 0', 400));
    }
  }

  if (req.body.order !== undefined) {
    req.body.order = Number(req.body.order);
  }

  const course = await Course.create(req.body);
  res.status(201).json({ status: 'success', data: course });
});

// Admin: update
exports.updateCourse = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.path;

  // Handle prices object
  if (req.body.lowerPrice !== undefined || req.body.mediumPrice !== undefined || req.body.higherPrice !== undefined) {
    req.body.prices = {
      lower: Number(req.body.lowerPrice),
      medium: Number(req.body.mediumPrice),
      higher: Number(req.body.higherPrice),
    };
    delete req.body.lowerPrice;
    delete req.body.mediumPrice;
    delete req.body.higherPrice;
  }

  // Validate prices
  if (req.body.prices) {
    const { lower, medium, higher } = req.body.prices;
    if (!Number.isFinite(lower) || lower <= 0 ||
        !Number.isFinite(medium) || medium <= 0 ||
        !Number.isFinite(higher) || higher <= 0) {
      return next(new AppError('All prices must be numbers greater than 0', 400));
    }
  }

  if (req.body.order !== undefined) {
    req.body.order = Number(req.body.order);
  }

  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) return next(new AppError('Course not found', 404));
  res.status(200).json({ status: 'success', data: course });
});

// Admin: delete
exports.deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  res.status(204).json({ status: 'success', data: null });
});
