const Booking = require('../models/Booking');
const Trek = require('../models/Trek');
const Guide = require('../models/Guide');
const Notification = require('../models/Notification');
const QRCode = require('qrcode');

exports.createBooking = async (req, res) => {
  try {
    const { trekId, guideId, bookingType, startDate, endDate, numberOfPeople, specialRequests, healthForm } = req.body;
    let amount = 0;

    if (bookingType === 'trek' && trekId) {
      const trek = await Trek.findById(trekId);
      if (!trek) return res.status(404).json({ success: false, message: 'Trek not found' });
      amount = trek.costPerPerson * (numberOfPeople || 1);
    } else if (bookingType === 'guide' && guideId) {
      const guide = await Guide.findById(guideId);
      if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
      amount = guide.basePricePerDay * days * (numberOfPeople || 1);
    }

    const booking = await Booking.create({
      user: req.user._id, trek: trekId, guide: guideId, bookingType,
      amount, startDate, endDate, numberOfPeople, specialRequests, healthForm,
      status: 'confirmed', paymentStatus: amount === 0 ? 'paid' : 'pending'
    });

    // Generate QR
    const qrData = JSON.stringify({ ref: booking.bookingRef, id: booking._id, user: req.user.name });
    booking.qrCode = await QRCode.toDataURL(qrData);
    await booking.save();

    if (trekId) {
      const trek = await Trek.findById(trekId);
      await Notification.create({
        recipient: trek.organizer, sender: req.user._id, type: 'booking_confirmed',
        title: 'New booking', message: `${req.user.name} booked your trek "${trek.title}"`,
        link: `/treks/${trekId}`
      });
    }

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('trek', 'title destination date coverImage difficulty')
      .populate({ path: 'guide', populate: { path: 'user', select: 'name avatar' } })
      .sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason;
    booking.cancelledAt = new Date();
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name avatar email')
      .populate('trek', 'title destination date coverImage meetingLocation organizer')
      .populate({ path: 'guide', populate: { path: 'user', select: 'name avatar' } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
