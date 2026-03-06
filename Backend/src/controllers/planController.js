const MembershipPlan = require('../models/MembershipPlan');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Public: get all active plans
exports.getAllPlans = catchAsync(async (req, res, next) => {
  const plans = await MembershipPlan.find({ isActive: true });
  res.status(200).json({ status: 'success', data: plans });
});

// Admin: get all (including inactive)
exports.getAllPlansAdmin = catchAsync(async (req, res, next) => {
  const plans = await MembershipPlan.find();
  res.status(200).json({ status: 'success', data: plans });
});

exports.getPlan = catchAsync(async (req, res, next) => {
  const plan = await MembershipPlan.findById(req.params.id);
  if (!plan) return next(new AppError('Plan not found', 404));
  res.status(200).json({ status: 'success', data: plan });
});

exports.createPlan = catchAsync(async (req, res, next) => {
  const plan = await MembershipPlan.create(req.body);
  res.status(201).json({ status: 'success', data: plan });
});

exports.updatePlan = catchAsync(async (req, res, next) => {
  const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!plan) return next(new AppError('Plan not found', 404));
  res.status(200).json({ status: 'success', data: plan });
});

exports.deletePlan = catchAsync(async (req, res, next) => {
  const plan = await MembershipPlan.findByIdAndDelete(req.params.id);
  if (!plan) return next(new AppError('Plan not found', 404));
  res.status(204).json({ status: 'success', data: null });
});