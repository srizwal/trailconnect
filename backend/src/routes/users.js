const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Trek = require('../models/Trek');

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar')
      .populate('completedTreks', 'title destination coverImage date');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Follow / Unfollow
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });
    const me = await User.findById(req.user._id);
    const isFollowing = me.following.includes(targetUser._id);
    if (isFollowing) {
      me.following.pull(targetUser._id);
      targetUser.followers.pull(me._id);
    } else {
      me.following.push(targetUser._id);
      targetUser.followers.push(me._id);
    }
    await me.save({ validateBeforeSave: false });
    await targetUser.save({ validateBeforeSave: false });
    res.json({ success: true, following: !isFollowing });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Get user's treks
router.get('/:id/treks', async (req, res) => {
  try {
    const treks = await Trek.find({ organizer: req.params.id, isPublic: true })
      .populate('organizer', 'name avatar').sort('-createdAt').limit(20);
    res.json({ success: true, treks });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
