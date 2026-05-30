const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Trek = require('../models/Trek');
const Guide = require('../models/Guide');
const Booking = require('../models/Booking');

router.use(protect, authorize('admin'));

router.get('/stats', async (req, res) => {
  try {
    const [users, treks, guides, bookings] = await Promise.all([
      User.countDocuments(), Trek.countDocuments(), Guide.countDocuments(), Booking.countDocuments()
    ]);
    const revenue = await Booking.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    res.json({ success: true, stats: { users, treks, guides, bookings, revenue: revenue[0]?.total || 0 } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt').limit(100);
    res.json({ success: true, users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/guides/:id/verify', async (req, res) => {
  try {
    const guide = await Guide.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    res.json({ success: true, guide });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/users/:id/ban', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/treks/:id/feature', async (req, res) => {
  try {
    const trek = await Trek.findByIdAndUpdate(req.params.id, { isFeatured: req.body.featured }, { new: true });
    res.json({ success: true, trek });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
