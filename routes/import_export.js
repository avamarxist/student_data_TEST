const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const imports = require('../controllers/importController');

// router.use(upload.single('fileUpload'));

// import routes

// const formidable = require('express-formidable');
// router.use(formidable({
//     uploadDir: './uploads'
// }));

// router.use(upload);

router.get('/import', imports.upload_view);

router.post('/import', upload.single('fileUpload'), imports.upload_post);

// export routes

module.exports = router;