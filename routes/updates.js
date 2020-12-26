const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const courseController = require('../controllers/courseController');
const staffController = require('../controllers/staffController');
const studentController = require('../controllers/studentController');
const imports = require('../controllers/importController');

router.get('/', (req, res)=>{
    res.render('pages/mainUpdates', {data: {}, message: "", params: {}});
})

// add routes

router.get('/student/add', (req, res)=>{
    res.render('pages/addStudent', {data: {}, message: "", params: {}})
})

router.post('/student/add', studentController.student_addNew);

router.get('/staff/add', (req, res)=>{
    res.render('pages/addStaff', {data: {}, message: "", params: {}})
})

router.post('/staff/add', staffController.staff_addNew);

router.get('/course/add', courseController.course_addNew_get);

router.post('/course/add', courseController.course_addNew_post);

router.get('/course/add/roster/:id', courseController.course_addStudents_get);

router.post('/course/add/roster/:id', courseController.course_addStudents_post);

// edit routes

router.get('/student/edit/:id', studentController.student_update_get);

router.get('/course/edit', courseController.group_courses_get);

router.post('/course/edit', courseController.group_courses_post);

// import routes

router.get('/import', imports.upload_view);

router.post('/import', upload.single('fileUpload'), imports.upload_post);

// export routes

module.exports = router;