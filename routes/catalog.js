const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const staffController = require('../controllers/staffController');
const courseController = require('../controllers/courseController');

// STUDENT ROUTES 

router.get('/student/view', studentController.students_list);

// router.get('/student/view/:id', studentController.student_detail);

router.get('/student/add', (req, res)=>{
    res.render('pages/addStudent', {})
})

router.post('/student/add', studentController.student_addNew);

// STAFF ROUTES

router.get('/staff/view', staffController.staff_list);

router.get('/staff/view:id', staffController.staff_detail);

router.get('/staff/add', (req, res)=>{
    res.render('pages/addStaff', {})
})

router.post('/staff/add', staffController.staff_addNew);

// COURSE ROUTES

router.get('/course', courseController.course_list_full);

router.get('/course/add', courseController.course_addNew_get);

router.post('/course/add', courseController.course_addNew_post);

router.get('/course/add/roster/:id', courseController.course_addStudents_get);

router.post('/course/add/roster/:id', courseController.course_addStudents_post);

module.exports = router;