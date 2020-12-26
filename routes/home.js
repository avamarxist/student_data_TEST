const express = require('express');
const router = express.Router();

const passport = require('passport');
const Staff = require('../mongo-schema/staffSchema');

router.get('/', (req, res)=>{
    if(!req.user){ res.redirect('/auth/login')}
    console.log(req.user);
    Staff.findById(req.user.staff_id, 'mainEmail').then((result)=>{
        let data = {email: result.mainEmail};
        res.render('pages/home', {data: data, message: '', params: {}});
    })
    .catch((err)=>{console.log(err)})
    
});


module.exports = router;