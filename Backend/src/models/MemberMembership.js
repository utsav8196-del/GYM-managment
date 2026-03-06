const mongoose = require('mongoose');

const memberMembershipSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' },
    amountPaid: Number,
    paymentMethod: { type: String, enum: ['cash', 'card', 'online'] },
    transactionId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('MemberMembership', memberMembershipSchema);