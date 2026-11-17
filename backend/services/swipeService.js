const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Process a like/pass from the demo user.
 * Mutual match is created only when the target has already liked the demo user.
 * Incoming likes are never returned in responses.
 */
const processSwipe = async (demoUser, profileId, action) => {
  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    throw createHttpError(400, 'Invalid profile ID');
  }

  if (!['like', 'pass'].includes(action)) {
    throw createHttpError(400, 'Action must be either "like" or "pass"');
  }

  const targetProfile = await Profile.findById(profileId);
  if (!targetProfile) {
    throw createHttpError(404, 'Profile not found');
  }

  if (String(targetProfile.userId) === String(demoUser._id)) {
    throw createHttpError(400, 'Cannot swipe on your own profile');
  }

  const existingSwipe = await Swipe.findOne({
    userId: demoUser._id,
    profileId: targetProfile._id,
  });

  if (existingSwipe) {
    throw createHttpError(409, 'You have already swiped on this profile');
  }

  try {
    await Swipe.create({
      userId: demoUser._id,
      profileId: targetProfile._id,
      action,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, 'You have already swiped on this profile');
    }
    throw error;
  }

  let matched = false;
  let matchPayload = null;

  if (action === 'like') {
    const demoProfile = await Profile.findOne({ userId: demoUser._id });
    if (!demoProfile) {
      throw createHttpError(500, 'Demo user profile is missing. Re-run the seed script.');
    }

    // Privacy: only check existence of a reciprocal like — never expose other incoming likes
    const reciprocalLike = await Swipe.findOne({
      userId: targetProfile.userId,
      profileId: demoProfile._id,
      action: 'like',
    });

    if (reciprocalLike) {
      const pairKey = [String(demoUser._id), String(targetProfile.userId)]
        .sort()
        .join('_');

      let matchDoc;
      try {
        matchDoc = await Match.create({
          userId: demoUser._id,
          matchedProfileId: targetProfile._id,
          pairKey,
        });
      } catch (error) {
        if (error.code === 11000) {
          matchDoc = await Match.findOne({
            $or: [
              { userId: demoUser._id, matchedProfileId: targetProfile._id },
              { pairKey },
            ],
          });
        } else {
          throw error;
        }
      }

      if (!matchDoc) {
        throw createHttpError(500, 'Failed to create or load match');
      }

      matched = true;
      matchPayload = {
        id: matchDoc._id,
        profile: {
          _id: targetProfile._id,
          name: targetProfile.name,
          age: targetProfile.age,
          photo: targetProfile.photo,
          bio: targetProfile.bio,
          city: targetProfile.city,
          interests: targetProfile.interests,
        },
      };
    }
  }

  return {
    success: true,
    matched,
    match: matchPayload,
  };
};

module.exports = {
  processSwipe,
};
