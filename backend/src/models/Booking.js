const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema({
  bookingRef: { type: String, default: () => uuidv4().slice(0, 8).toUpperCase(), unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trek: { type: mongoose.Schema.Types.ObjectId, ref: 'Trek' },
  guide: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide' },
  bookingType: { type: String, enum: ['trek', 'guide', 'custom'], required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'], default: 'pending' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentIntentId: String,
  startDate: Date,
  endDate: Date,
  numberOfPeople: { type: Number, default: 1 },
  specialRequests: String,
  healthForm: {
    hasConditions: Boolean,
    conditions: String,
    emergencyContact: { name: String, phone: String },
    agreedToTerms: Boolean,
  },
  qrCode: String,
  cancellationReason: String,
  cancelledAt: Date,
  refundAmount: Number,
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
