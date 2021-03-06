const express = require('express');
const router = express.Router();

const attendanceController = require('../controllers/attendanceController');
const commentController = require('../controllers/commentController');

const Course = require('../mongo-schema/courseSchema');
const Staff = require('../mongo-schema/staffSchema');

router.get('/', (req, res)=>{
    res.render('pages/mainEntries', {});
})

// COMMENT ROUTES 

router.get('/comment/list', commentController.comment_list);

router.post('/comment/list', commentController.comment_list);

router.get('/comment/calendar', commentController.comment_calendar);

router.get('/comment/add', commentController.comment_addNew_get);

router.post('/comment/add', commentController.comment_addNew_post);

// ATTENDANCE ROUTES

router.get('/attendance/add', attendanceController.get_addNew);

router.post('/attendance/add', attendanceController.post_addNew);


module.exports = router;