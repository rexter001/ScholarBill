const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate('user', 'name email')
      .populate('plan', 'name price');
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPlans = await Plan.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'Active' });

    res.json({
      totalUsers,
      totalPlans,
      activeSubscriptions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getSubscriptions,
  getDashboardStats,
};