const Contact = require('../models/ContactSubmission');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Public: submit contact form
exports.createContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({ status: 'success', data: contact });
});

// Admin: list all
exports.getAllContacts = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find().sort('-createdAt');
  res.status(200).json({ status: 'success', results: contacts.length, data: contacts });
});

// Admin: get single
exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return next(new AppError('Contact not found', 404));
  res.status(200).json({ status: 'success', data: contact });
});

// Admin: delete
exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return next(new AppError('Contact not found', 404));
  res.status(204).json({ status: 'success', data: null });
});