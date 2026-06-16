const express = require('express');
const router = express.Router();
const { getUsers, getSubscriptions, getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/users', protect, admin, getUsers);
router.get('/subscriptions', protect, admin, getSubscriptions);
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;