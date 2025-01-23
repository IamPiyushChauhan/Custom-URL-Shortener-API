const express = require('express');
const router = express();
const passport = require('passport'); 
const redis = require('./../redis-client')
require('../passport');

router.use(passport.initialize()); 
router.use(passport.session());


// Auth 
router.get('/google' , passport.authenticate('google', { scope: 
	[ 'email', 'profile' ] 
})); 

// Auth Callback 
router.get( '/google/callback', 
	passport.authenticate( 'google', { 
		successRedirect: '/success', 
		failureRedirect: '/failure'
}));

module.exports = router;

