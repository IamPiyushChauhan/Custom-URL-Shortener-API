const express = require('express');
const router = express();
const passport = require('passport'); 

require('../passport');

router.use(passport.initialize()); 
router.use(passport.session());

const userController = require('../controllers/userController');

router.get('/', userController.loadAuth);

router.get('/success' , userController.successGoogleLogin); 

router.get('/failure' , userController.failureGoogleLogin);


module.exports = router;

