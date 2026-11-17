const { getMatches } = require('../services/matchService');

const getMatchesHandler = async (req, res, next) => {
  try {
    const matches = await getMatches(req.demoUser);

    res.json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMatchesHandler,
};
