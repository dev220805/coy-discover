const User = require('../models/User');

/**
 * Resolves the single demo logged-in user for every request.
 * No auth is implemented per assignment requirements.
 */
const attachDemoUser = async (req, res, next) => {
  try {
    let demoUser = null;

    if (process.env.DEMO_USER_ID) {
      demoUser = await User.findById(process.env.DEMO_USER_ID);
    }

    if (!demoUser) {
      demoUser = await User.findOne({ isDemo: true });
    }

    if (!demoUser) {
      return res.status(503).json({
        success: false,
        message: 'Demo user not found. Please run the seed script: npm run seed',
      });
    }

    req.demoUser = demoUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = attachDemoUser;
