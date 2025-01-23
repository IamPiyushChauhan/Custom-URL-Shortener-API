const express = require('express');
const { postUrlShorten, getRedirectUrl, getAnalyticsAlias, getAnalyticsTopic, getOverallAnalytics } = require('../controllers/apiController');
const validateUrl = require('../middleware/validateUrlMiddleware');
const validateCustomAlias = require('../middleware/validateCustomAliasMiddleware');
const authenticateUser = require('../middleware/authenticateUserMiddleware');
const validateAlias = require('../middleware/validateAliasMiddleware');
const validateTopic = require('../middleware/validateTopicMiddleware');
const authenticateAliasForAnalytics = require('../middleware/authenticateAliasForAnalyticsMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

const router = express.Router();


router.post('/shorten',rateLimit,authenticateUser,validateUrl,validateCustomAlias,postUrlShorten);
router.get('/analytics/overall',authenticateUser,getOverallAnalytics);
router.get('/shorten/:alias',validateAlias,getRedirectUrl);
router.get('/analytics/:alias',authenticateUser,authenticateAliasForAnalytics,getAnalyticsAlias);
router.get('/analytics/topic/:topic',authenticateUser,validateTopic,getAnalyticsTopic);


module.exports = router;