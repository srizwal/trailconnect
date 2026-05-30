const mongoose = require('mongoose');

const trekSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  meetingLocation: { type: String, required: true },
  meetingCoords: { lat: Number, lng: Number },
  routeCoords: [{ lat: Number, lng: Number }],
  difficulty: { type: String, enum: ['easy', 'moderate', 'hard', 'extreme'], required: true },
  duration: { type: String, required: true },
  totalSeats: { type: Number, required: true, min: 1 },
  costPerPerson: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  date: { type: Date, required: true },
  endDate: Date,
  requiredEquipment: [String],
  images: [String],
  coverImage: { type: String, default: '' },
  isPublic: { type: Boolean, default: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['confirmed', 'waitlisted', 'cancelled'], default: 'confirmed' },
    paid: { type: Boolean, default: false }
  }],
  guide: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide' },
  tags: [String],
  elevation: { gain: Number, maxAlt: Number },
  distance: Number,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  weatherAlerts: [String],
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  cancelReason: String,
}, { timestamps: true });

trekSchema.virtual('confirmedMembers').get(function () {
  return this.members.filter(m => m.status === 'confirmed').length;
});

trekSchema.virtual('availableSeats').get(function () {
  const confirmed = this.members.filter(m => m.status === 'confirmed').length;
  return Math.max(0, this.totalSeats - confirmed);
});

trekSchema.virtual('isFull').get(function () {
  return this.availableSeats === 0;
});

trekSchema.set('toJSON', { virtuals: true });
trekSchema.set('toObject', { virtuals: true });

trekSchema.index({ destination: 'text', title: 'text', description: 'text' });
trekSchema.index({ date: 1, difficulty: 1, status: 1 });

module.exports = mongoose.model('Trek', trekSchema);
