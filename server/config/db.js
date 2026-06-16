const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDefaultPlans();
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDefaultPlans = async () => {
  try {
    const Plan = mongoose.model('Plan');
    const planCount = await Plan.countDocuments();
    if (planCount === 0) {
      const defaultPlans = [
        { name: 'Free Plan', price: 0, description: 'Access basic student billing tools.' },
        { name: 'Pro Plan', price: 299, description: 'Advanced reporting and billing management.' },
        { name: 'Enterprise Plan', price: 999, description: 'Full system capabilities with priority support.' }
      ];
      await Plan.insertMany(defaultPlans);
      console.log('Default plans seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding default plans:', err.message);
  }
};

module.exports = connectDB;