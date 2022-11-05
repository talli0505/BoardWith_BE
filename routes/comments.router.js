const express = require('express');
const router = express.Router();
const CommentsController = require('../controllers/commments');
const authMiddleware = require('../middleware/auth-middleware');
const commentsController = new CommentsController();

router.get('/:_id', commentsController.getComments);
router.post('/:_id', authMiddleware, commentsController.createComment);
router.put('/:_id', authMiddleware, commentsController.editComment);
router.delete('/:_id', authMiddleware, commentsController.deleteComment);

module.exports = router;