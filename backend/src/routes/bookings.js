// ===== routes/bookings.js =====
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createBooking, getMyBookings, cancelBooking, getBooking } = require('../controllers/bookingController');
router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);
module.exports = router;
