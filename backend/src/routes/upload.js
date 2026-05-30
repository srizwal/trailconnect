const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Placeholder – swap in real Cloudinary when API key is set
router.post('/image', protect, async (req, res) => {
  try {
    // With Cloudinary configured:
    // const cloudinary = require('cloudinary').v2;
    // const result = await cloudinary.uploader.upload(req.body.image, { folder: 'trailconnect' });
    // return res.json({ success: true, url: result.secure_url });

    // Stub – return a placehold.co URL based on a hash
    const seed = Math.random().toString(36).slice(2, 8);
    res.json({ success: true, url: `https://placehold.co/800x600/1a1a2e/white?text=TrailConnect+${seed}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
