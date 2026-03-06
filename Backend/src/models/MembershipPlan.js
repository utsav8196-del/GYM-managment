const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    durationDays: { type: Number, required: true }, // e.g., 30, 90, 180, 365
    price: { type: Number, required: true },
    features: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MembershipPlan', planSchema);