const express = require('express');
const router = express.Router();
const { getMySubscription, createOrUpdateSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMySubscription)
  .post(protect, createOrUpdateSubscription);

module.exports = router;