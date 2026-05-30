const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  certifications: [{ name: String, issuedBy: String, year: Number, image: String }],
  yearsExperience: { type: Number, default: 0 },
  languages: [String],
  specializations: [String],
  basePricePerDay: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  location: String,
  serviceAreas: [String],
  difficultyHandled: [{ type: String, enum: ['easy', 'moderate', 'hard', 'extreme'] }],
  emergencyTraining: [String],
  bio: String,
  photos: [String],
  coverPhoto: String,
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  availability: [{
    date: Date,
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  customTripAvailable: { type: Boolean, default: true },
  insuranceInfo: String,
  socialLinks: { instagram: String, youtube: String, website: String },
  responseTime: { type: String, default: 'Within 24 hours' },
  completionRate: { type: Number, default: 100 },
}, { timestamps: true });

module.exports = mongoose.model('Guide', guideSchema);
