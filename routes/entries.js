const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');


// COMMENT ROUTES 

router.get('/comment/list', commentController.comment_list);

router.post('/comment/list', commentController.comment_list);

router.get('/comment/calendar', commentController.comment_calendar);

router.get('/comment/add', commentController.comment_addNew_get);

router.post('/comment/add', commentController.comment_addNew_post);

// ATTENDANCE ROUTES



module.exports = router;