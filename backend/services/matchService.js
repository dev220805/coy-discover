const Match = require('../models/Match');
const { PUBLIC_PROFILE_FIELDS } = require('./feedService');

/**
 * Returns only confirmed mutual matches for the demo user.
 * One-sided likes are never included.
 */
const getMatches = async (demoUser) => {
  const matches = await Match.find({ userId: demoUser._id })
    .populate({
      path: 'matchedProfileId',
      select: PUBLIC_PROFILE_FIELDS,
    })
    .sort({ createdAt: -1 })
    .lean();

  return matches
    .filter((match) => match.matchedProfileId)
    .map((match) => ({
      id: match._id,
      createdAt: match.createdAt,
      profile: match.matchedProfileId,
    }));
};

module.exports = {
  getMatches,
};
