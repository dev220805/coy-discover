const Profile = require('../models/Profile');
const { PUBLIC_PROFILE_FIELDS } = require('../services/feedService');

const getMeHandler = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.demoUser._id })
      .select(PUBLIC_PROFILE_FIELDS)
      .lean();

    res.json({
      success: true,
      user: {
        id: req.demoUser._id,
        name: req.demoUser.name,
        age: req.demoUser.age,
        photo: req.demoUser.photo,
        bio: req.demoUser.bio,
        city: req.demoUser.city,
        interests: req.demoUser.interests,
        profileId: profile?._id || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMeHandler,
};
