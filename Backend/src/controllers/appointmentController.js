const Appointment = require('../models/Appointment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Public: create appointment
exports.createAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.create(req.body);
  res.status(201).json({ status: 'success', data: appointment });
});

// Admin: get all appointments
exports.getAllAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find().sort('-createdAt');
  res.status(200).json({ status: 'success', results: appointments.length, data: appointments });
});

// Admin: get single
exports.getAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return next(new AppError('Appointment not found', 404));
  res.status(200).json({ status: 'success', data: appointment });
});

// Admin: update status
exports.updateAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!appointment) return next(new AppError('Appointment not found', 404));
  res.status(200).json({ status: 'success', data: appointment });
});

// Admin: delete
exports.deleteAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) return next(new AppError('Appointment not found', 404));
  res.status(204).json({ status: 'success', data: null });
});