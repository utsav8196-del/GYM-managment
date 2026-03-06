const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['booked', 'attended', 'cancelled'], default: 'booked' },
    attended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClassBooking', bookingSchema);