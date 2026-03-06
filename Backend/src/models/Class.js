const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    schedule: [
      {
        day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        startTime: String, // e.g., "09:00"
        endTime: String,
      },
    ],
    capacity: { type: Number, required: true },
    duration: Number, // minutes
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);