const Profile = require('../models/Profile');
const Swipe = require('../models/Swipe');

const PUBLIC_PROFILE_FIELDS = 'name age photo bio city interests';

/**
 * Returns discoverable profiles the demo user has not already swiped on.
 * Never includes incoming-like metadata.
 */
const getFeed = async (demoUser) => {
  const demoProfile = await Profile.findOne({ userId: demoUser._id }).select('_id');

  const swipedProfileIds = await Swipe.find({ userId: demoUser._id }).distinct('profileId');

  const excludeIds = [...swipedProfileIds];
  if (demoProfile) {
    excludeIds.push(demoProfile._id);
  }

  const profiles = await Profile.find({
    _id: { $nin: excludeIds },
    userId: { $ne: demoUser._id },
  })
    .select(PUBLIC_PROFILE_FIELDS)
    .sort({ createdAt: 1 })
    .lean();

  return profiles;
};

module.exports = {
  getFeed,
  PUBLIC_PROFILE_FIELDS,
};
