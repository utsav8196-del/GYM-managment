const Service = require('../models/Service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const ALLOWED_ICONS = new Set(['Dumbbell', 'Flame', 'HeartPulse']);

const parseHighlights = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0)
      .slice(0, 6);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .slice(0, 6);
  }

  return [];
};

const buildServicePayload = (body = {}, isUpdate = false) => {
  const payload = {};

  if (!isUpdate || Object.prototype.hasOwnProperty.call(body, 'title')) {
    if (typeof body.title !== 'string' || body.title.trim().length < 3) {
      throw new AppError('Title must be at least 3 characters long', 400);
    }
    payload.title = body.title.trim();
  }

  if (!isUpdate || Object.prototype.hasOwnProperty.call(body, 'description')) {
    if (typeof body.description !== 'string' || body.description.trim().length < 10) {
      throw new AppError('Description must be at least 10 characters long', 400);
    }
    payload.description = body.description.trim();
  }

  if (!isUpdate || Object.prototype.hasOwnProperty.call(body, 'icon')) {
    if (typeof body.icon !== 'string' || !ALLOWED_ICONS.has(body.icon)) {
      throw new AppError('Icon must be one of: Dumbbell, Flame, HeartPulse', 400);
    }
    payload.icon = body.icon;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'image')) {
    if (body.image === null || body.image === undefined || body.image === '') {
      payload.image = undefined;
    } else if (typeof body.image === 'string') {
      payload.image = body.image.trim();
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'shortText')) {
    if (body.shortText === null || body.shortText === undefined || body.shortText === '') {
      payload.shortText = undefined;
    } else if (typeof body.shortText === 'string') {
      payload.shortText = body.shortText.trim();
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'highlights')) {
    payload.highlights = parseHighlights(body.highlights);
  }

  if (!isUpdate || Object.prototype.hasOwnProperty.call(body, 'order')) {
    const rawOrder = body.order === undefined || body.order === null || body.order === '' ? 0 : body.order;
    const parsedOrder = Number(rawOrder);
    if (!Number.isFinite(parsedOrder)) {
      throw new AppError('Order must be a valid number', 400);
    }
    payload.order = parsedOrder;
  }

  if (isUpdate && Object.keys(payload).length === 0) {
    throw new AppError('Please provide at least one field to update', 400);
  }

  return payload;
};

// Public: get all services (ordered)
exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await Service.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({ status: 'success', data: services });
});

// Public: get single service
exports.getServiceById = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service) return next(new AppError('Service not found', 404));

  res.status(200).json({ status: 'success', data: service });
});

// Admin: get all (same payload as public, kept for role-based panels)
exports.getAllServicesAdmin = catchAsync(async (req, res, next) => {
  const services = await Service.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({ status: 'success', data: services });
});

// Admin: create
exports.createService = catchAsync(async (req, res, next) => {
  const payload = buildServicePayload(req.body, false);
  const service = await Service.create(payload);
  res.status(201).json({ status: 'success', data: service });
});

// Admin: update
exports.updateService = catchAsync(async (req, res, next) => {
  const payload = buildServicePayload(req.body, true);

  const service = await Service.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!service) return next(new AppError('Service not found', 404));
  res.status(200).json({ status: 'success', data: service });
});

// Admin: delete
exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return next(new AppError('Service not found', 404));
  res.status(204).json({ status: 'success', data: null });
});
