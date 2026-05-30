const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guide: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide' },
  trek: { type: mongoose.Schema.Types.ObjectId, ref: 'Trek' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: { type: String, required: true },
  photos: [String],
  helpfulVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

reviewSchema.index({ guide: 1, reviewer: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);
