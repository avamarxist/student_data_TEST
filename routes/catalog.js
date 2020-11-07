const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const staffController = require('../controllers/staffController');
const courseController = require('../controllers/courseController');

// STUDENT ROUTES 

router.get('/student', studentController.students_list);

// router.get('/student/:id', studentController.student_detail);

router.get('/student/add', (req, res)=>{
    res.render('pages/addStudent', {})
})

router.post('/student/add', studentController.student_addNew);

// STAFF ROUTES

router.get('/staff', staffController.staff_list);

router.get('/staff/:id', staffController.staff_detail);

router.post('/staff/add', staffController.staff_addNew);

// COURSE ROUTES

router.get('/course', courseController.course_list_full);

router.post('/course/add', courseController.course_addNew);

module.exports = router;