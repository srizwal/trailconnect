const Trek = require('../models/Trek');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getAllTreks = async (req, res) => {
  try {
    const { difficulty, status = 'upcoming', search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const query = { isPublic: true };
    if (difficulty) query.difficulty = difficulty;
    if (status) query.status = status;
    if (search) query.$text = { $search: search };

    const total = await Trek.countDocuments(query);
    const treks = await Trek.find(query)
      .populate('organizer', 'name avatar experienceLevel')
      .populate('guide', 'user basePricePerDay rating')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, treks, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id)
      .populate('organizer', 'name avatar bio experienceLevel location')
      .populate('members.user', 'name avatar experienceLevel')
      .populate('guide');
    if (!trek) return res.status(404).json({ success: false, message: 'Trek not found' });
    trek.views += 1;
    await trek.save({ validateBeforeSave: false });
    res.json({ success: true, trek });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTrek = async (req, res) => {
  try {
    const trek = await Trek.create({ ...req.body, organizer: req.user._id });
    res.status(201).json({ success: true, trek });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ success: false, message: 'Trek not found' });
    if (trek.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    const updated = await Trek.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, trek: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ success: false, message: 'Trek not found' });
    if (trek.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await trek.deleteOne();
    res.json({ success: true, message: 'Trek deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.joinTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ success: false, message: 'Trek not found' });
    if (trek.status !== 'upcoming') return res.status(400).json({ success: false, message: 'Trek is not accepting members' });

    const alreadyJoined = trek.members.find(m => m.user.toString() === req.user._id.toString());
    if (alreadyJoined) return res.status(400).json({ success: false, message: 'Already joined this trek' });

    const confirmed = trek.members.filter(m => m.status === 'confirmed').length;
    const status = confirmed >= trek.totalSeats ? 'waitlisted' : 'confirmed';

    trek.members.push({ user: req.user._id, status });
    await trek.save();

    // Notify organizer
    await Notification.create({
      recipient: trek.organizer,
      sender: req.user._id,
      type: 'trek_join',
      title: 'New member joined',
      message: `${req.user.name} joined your trek "${trek.title}"`,
      link: `/treks/${trek._id}`
    });

    res.json({ success: true, message: status === 'waitlisted' ? 'Added to waitlist' : 'Joined successfully', status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.leaveTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ success: false, message: 'Trek not found' });
    trek.members = trek.members.filter(m => m.user.toString() !== req.user._id.toString());
    // Promote waitlisted
    const confirmed = trek.members.filter(m => m.status === 'confirmed').length;
    if (confirmed < trek.totalSeats) {
      const waitlisted = trek.members.find(m => m.status === 'waitlisted');
      if (waitlisted) waitlisted.status = 'confirmed';
    }
    await trek.save();
    res.json({ success: true, message: 'Left trek successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.likeTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ success: false, message: 'Trek not found' });
    const idx = trek.likes.indexOf(req.user._id);
    if (idx === -1) trek.likes.push(req.user._id);
    else trek.likes.splice(idx, 1);
    await trek.save();
    res.json({ success: true, likes: trek.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ success: false, message: 'Trek not found' });
    trek.comments.push({ user: req.user._id, text: req.body.text });
    await trek.save();
    const populated = await Trek.findById(trek._id).populate('comments.user', 'name avatar');
    res.json({ success: true, comments: populated.comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeaturedTreks = async (req, res) => {
  try {
    const treks = await Trek.find({ isFeatured: true, status: 'upcoming', isPublic: true })
      .populate('organizer', 'name avatar')
      .limit(6).sort('-createdAt');
    res.json({ success: true, treks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
