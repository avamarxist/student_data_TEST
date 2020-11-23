const express = require('express');
const router = express.Router();

const passport = require('passport');
const Staff = require('../mongo-schema/staffSchema');

router.get('/', (req, res)=>{
    if(!req.user){ res.redirect('/auth/login')}
    console.log(req.user);
    Staff.findById(req.user.staff_id, 'mainEmail').then((result)=>{
        res.render('pages/home', {email: result.mainEmail});
    })
    .catch((err)=>{console.log(err)})
    
});


module.exports = router;