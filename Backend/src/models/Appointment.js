const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['personal', 'group', 'cardio', 'strength'], required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:MM AM/PM
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    notes: String,
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);