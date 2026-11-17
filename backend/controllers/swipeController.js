const { body } = require('express-validator');
const { processSwipe } = require('../services/swipeService');

const swipeValidators = [
  body('profileId')
    .exists()
    .withMessage('profileId is required')
    .bail()
    .isMongoId()
    .withMessage('profileId must be a valid ID'),
  body('action')
    .exists()
    .withMessage('action is required')
    .bail()
    .isIn(['like', 'pass'])
    .withMessage('action must be either "like" or "pass"'),
];

const createSwipeHandler = async (req, res, next) => {
  try {
    const { profileId, action } = req.body;
    const result = await processSwipe(req.demoUser, profileId, action);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  swipeValidators,
  createSwipeHandler,
};
