const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const Guide = require('../models/Guide');

router.post('/', protect, async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, reviewer: req.user._id });
    if (req.body.guide) {
      const reviews = await Review.find({ guide: req.body.guide });
      const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
      await Guide.findByIdAndUpdate(req.body.guide, { rating: Math.round(avg * 10) / 10, reviewCount: reviews.length });
    }
    res.status(201).json({ success: true, review });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/guide/:guideId', async (req, res) => {
  try {
    const reviews = await Review.find({ guide: req.params.guideId })
      .populate('reviewer', 'name avatar').sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
