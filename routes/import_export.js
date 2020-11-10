const express = require('express');
const router = express.Router();

const imports = require('../controllers/importController');

// import routes

router.get('/import', imports.upload_view);

router.post('/import', imports.upload_post);

// export routes

module.exports = router;