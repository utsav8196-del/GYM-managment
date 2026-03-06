const GalleryImage = require('../models/GalleryImage');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Public: get all images
exports.getAllImages = catchAsync(async (req, res, next) => {
  const images = await GalleryImage.find().sort('order');
  res.status(200).json({ status: 'success', data: images });
});

// Admin: create with upload
exports.createImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('Please upload an image', 400));
  req.body.image = req.file.path;
  const image = await GalleryImage.create(req.body);
  res.status(201).json({ status: 'success', data: image });
});

// Admin: update
exports.updateImage = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.path;
  const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!image) return next(new AppError('Image not found', 404));
  res.status(200).json({ status: 'success', data: image });
});

// Admin: delete
exports.deleteImage = catchAsync(async (req, res, next) => {
  const image = await GalleryImage.findByIdAndDelete(req.params.id);
  if (!image) return next(new AppError('Image not found', 404));
  res.status(204).json({ status: 'success', data: null });
});