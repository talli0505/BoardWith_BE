const express = require('express');
const router = express.Router();
const CommentsController = require('../controllers/commments');
const authMiddleware = require('../middleware/auth-middleware');
const commentsController = new CommentsController();

router.get('/:postId', commentsController.getComments);
router.post('/:postId', authMiddleware, commentsController.createComment);
router.put('/:commentId', authMiddleware, commentsController.editComment);
router.delete('/:commentId', authMiddleware, commentsController.deleteComment);

module.exports = router;