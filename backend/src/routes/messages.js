// routes/messages.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');

router.get('/:conversationId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name avatar').sort('createdAt').limit(100);
    res.json({ success: true, messages });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const msg = await Message.create({ ...req.body, sender: req.user._id });
    const populated = await Message.findById(msg._id).populate('sender', 'name avatar');
    res.status(201).json({ success: true, message: populated });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
