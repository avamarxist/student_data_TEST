const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/', (req, res)=>{
    console.log(req.user);
    res.send(`Logged in as ${req.user}`);
});


module.exports = router;