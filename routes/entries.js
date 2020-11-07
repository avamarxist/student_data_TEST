const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');


// COMMENT ROUTES 

router.get('/comment/list', commentController.comment_list);

router.get('/comment/calendar', commentController.comment_calendar);

router.post('/comment/add', commentController.comment_addNew);

// ATTENDANCE ROUTES



module.exports = router;