const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // e.g., 'Dumbbell', 'Flame', 'HeartPulse'
    image: { type: String, trim: true }, // e.g., '/images/personal-training.jpg'
    shortText: { type: String, trim: true },
    highlights: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
