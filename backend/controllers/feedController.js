const { getFeed } = require('../services/feedService');

const getFeedHandler = async (req, res, next) => {
  try {
    const profiles = await getFeed(req.demoUser);

    res.json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeedHandler,
};
