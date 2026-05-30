const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getAllTreks, getTrek, createTrek, updateTrek, deleteTrek,
  joinTrek, leaveTrek, likeTrek, addComment, getFeaturedTreks
} = require('../controllers/trekController');

router.get('/', optionalAuth, getAllTreks);
router.get('/featured', getFeaturedTreks);
router.get('/:id', optionalAuth, getTrek);
router.post('/', protect, createTrek);
router.put('/:id', protect, updateTrek);
router.delete('/:id', protect, deleteTrek);
router.post('/:id/join', protect, joinTrek);
router.post('/:id/leave', protect, leaveTrek);
router.post('/:id/like', protect, likeTrek);
router.post('/:id/comment', protect, addComment);

module.exports = router;
