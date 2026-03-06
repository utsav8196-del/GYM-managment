const Course = require('../models/Course');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Public: get all courses
exports.getAllCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find().sort('order');
  res.status(200).json({ status: 'success', data: courses });
});

// Admin: create (with image upload)
exports.createCourse = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.path; // store path
  const course = await Course.create(req.body);
  res.status(201).json({ status: 'success', data: course });
});

// Admin: update
exports.updateCourse = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.path;
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