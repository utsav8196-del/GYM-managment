const BlogPost = require('../models/BlogPost');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Public: list with pagination
exports.getAllPosts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await BlogPost.find().sort('-publishedAt').skip(skip).limit(limit);
  const total = await BlogPost.countDocuments();

  res.status(200).json({
    status: 'success',
    results: posts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: posts,
  });
});

// Public: get single by slug
exports.getPostBySlug = catchAsync(async (req, res, next) => {
  const post = await BlogPost.findOne({ slug: req.params.slug });
  if (!post) return next(new AppError('Post not found', 404));
  res.status(200).json({ status: 'success', data: post });
});

// Admin: create
exports.createPost = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.path;
  const post = await BlogPost.create(req.body);
  res.status(201).json({ status: 'success', data: post });
});

// Admin: update
exports.updatePost = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.path;
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) return next(new AppError('Post not found', 404));
  res.status(200).json({ status: 'success', data: post });
});

// Admin: delete
exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) return next(new AppError('Post not found', 404));
  res.status(204).json({ status: 'success', data: null });
});