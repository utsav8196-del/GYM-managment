const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // file path or URL
    type: { type: String, enum: ['personal', 'group'], required: true },
    order: { type: Number, default: 0 },
    prices: {
      lower: {
        type: Number,
        required: [true, 'Lower price is required'],
        min: [1, 'Price must be greater than 0'],
      },
      medium: {
        type: Number,
        required: [true, 'Medium price is required'],
        min: [1, 'Price must be greater than 0'],
      },
      higher: {
        type: Number,
        required: [true, 'Higher price is required'],
        min: [1, 'Price must be greater than 0'],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);