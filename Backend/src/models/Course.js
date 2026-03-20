const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // file path or URL
    type: { type: String, enum: ['personal', 'group'], required: true },
    order: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'A course must have a price'],
      min: [1, 'Price must be greater than 0'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);