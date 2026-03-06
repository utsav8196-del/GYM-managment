const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    method: { type: String, enum: ['cash', 'card', 'online'], required: true },
    description: String,
    referenceId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);