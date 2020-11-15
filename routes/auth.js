const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../passport');

const User = require('../mongo-schema/userSchema');

router.get('/login', (req, res)=>{
    res.render('pages/login');
})

router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/login' }), 
    (req, res)=> { res.redirect('/') }
);


module.exports = router;