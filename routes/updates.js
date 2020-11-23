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
    res.render('pages/mainUpdates');
})

// add or update routes

router.get('/student/add', (req, res)=>{
    res.render('pages/addStudent', {})
})

router.post('/student/add', studentController.student_addNew);

router.get('/staff/add', (req, res)=>{
    res.render('pages/addStaff', {})
})

router.post('/staff/add', staffController.staff_addNew);

router.get('/course/add', courseController.course_addNew_get);

router.post('/course/add', courseController.course_addNew_post);

router.get('/course/add/roster/:id', courseController.course_addStudents_get);

router.post('/course/add/roster/:id', courseController.course_addStudents_post);

// import routes

router.get('/import', imports.upload_view);

router.post('/import', upload.single('fileUpload'), imports.upload_post);

// export routes

module.exports = router;