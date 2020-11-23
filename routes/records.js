const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const staffController = require('../controllers/staffController');
const courseController = require('../controllers/courseController');

router.get('/', (req, res)=>{
    res.render('pages/mainRecords', {});
})

// STUDENT ROUTES 

router.get('/student/view/all', studentController.students_list);

router.get('/student/view/:id', studentController.student_detail);
router.post('/student/view/', studentController.student_detail);


// STAFF ROUTES

router.get('/staff/view', staffController.staff_list);

router.get('/staff/view:id', staffController.staff_detail);

// COURSE ROUTES

router.get('/course', courseController.course_list_full);

module.exports = router;