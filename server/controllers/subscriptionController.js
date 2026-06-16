const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id })
      .populate('plan')
      .populate('user', 'name email');

    if (!subscription) {
      return res.status(200).json(null);
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrUpdateSubscription = async (req, res) => {
  const { planId } = req.body;

  try {
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    let subscription = await Subscription.findOne({ user: req.user.id });

    if (subscription) {
      subscription.plan = planId;
      subscription.status = 'Active';
      subscription.startDate = Date.now();
      await subscription.save();
    } else {
      subscription = await Subscription.create({
        user: req.user.id,
        plan: planId,
        status: 'Active',
      });
    }

    const populatedSub = await Subscription.findById(subscription._id).populate('plan');
    res.status(201).json(populatedSub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMySubscription,
  createOrUpdateSubscription,
};