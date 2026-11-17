const express = require('express');
const attachDemoUser = require('../middleware/demoUser');
const validate = require('../middleware/validate');
const { getFeedHandler } = require('../controllers/feedController');
const { swipeValidators, createSwipeHandler } = require('../controllers/swipeController');
const { getMatchesHandler } = require('../controllers/matchController');
const { getMeHandler } = require('../controllers/meController');

const router = express.Router();

router.use(attachDemoUser);

router.get('/me', getMeHandler);
router.get('/feed', getFeedHandler);
router.post('/swipe', swipeValidators, validate, createSwipeHandler);
router.get('/matches', getMatchesHandler);

module.exports = router;
