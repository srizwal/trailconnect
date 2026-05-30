const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6, select: false },
  googleId: String,
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'guide', 'admin'], default: 'user' },
  bio: { type: String, maxlength: 500, default: '' },
  location: { type: String, default: '' },
  experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'beginner' },
  completedTreks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trek' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  badges: [{ name: String, icon: String, earnedAt: Date }],
  emergencyContact: { name: String, phone: String, relation: String },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastSeen: Date,
  pushTokens: [String],
  savedTreks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trek' }],
  healthConditions: String,
  preferredDifficulty: [String],
  languages: [String],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
