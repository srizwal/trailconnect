const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAllGuides, getGuide, createGuideProfile, updateGuideProfile, getMyGuideProfile } = require('../controllers/guideController');

router.get('/', getAllGuides);
router.get('/me', protect, getMyGuideProfile);
router.get('/:id', getGuide);
router.post('/', protect, createGuideProfile);
router.put('/me', protect, updateGuideProfile);

module.exports = router;
