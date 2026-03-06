const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    checkIn: { type: Date, default: Date.now },
    checkOut: Date,
    type: { type: String, enum: ['general', 'class'], default: 'general' },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);