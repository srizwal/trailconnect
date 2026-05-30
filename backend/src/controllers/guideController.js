const Guide = require('../models/Guide');
const User = require('../models/User');
const Review = require('../models/Review');

exports.getAllGuides = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, language, difficulty, minRating, page = 1, limit = 12, search } = req.query;
    const query = { isAvailable: true };
    if (location) query.$or = [{ location: new RegExp(location, 'i') }, { serviceAreas: new RegExp(location, 'i') }];
    if (minPrice || maxPrice) query.basePricePerDay = {};
    if (minPrice) query.basePricePerDay.$gte = Number(minPrice);
    if (maxPrice) query.basePricePerDay.$lte = Number(maxPrice);
    if (language) query.languages = language;
    if (difficulty) query.difficultyHandled = difficulty;
    if (minRating) query.rating = { $gte: Number(minRating) };

    const total = await Guide.countDocuments(query);
    const guides = await Guide.find(query)
      .populate('user', 'name avatar bio location experienceLevel')
      .sort('-rating -reviewCount')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, guides, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getGuide = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id).populate('user', 'name avatar bio location followers following completedTreks');
    if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });
    const reviews = await Review.find({ guide: guide._id }).populate('reviewer', 'name avatar').sort('-createdAt').limit(10);
    res.json({ success: true, guide, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createGuideProfile = async (req, res) => {
  try {
    const existing = await Guide.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Guide profile already exists' });
    const guide = await Guide.create({ ...req.body, user: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { role: 'guide' });
    res.status(201).json({ success: true, guide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateGuideProfile = async (req, res) => {
  try {
    const guide = await Guide.findOneAndUpdate({ user: req.user._id }, req.body, { new: true, runValidators: true });
    if (!guide) return res.status(404).json({ success: false, message: 'Guide profile not found' });
    res.json({ success: true, guide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyGuideProfile = async (req, res) => {
  try {
    const guide = await Guide.findOne({ user: req.user._id });
    res.json({ success: true, guide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
