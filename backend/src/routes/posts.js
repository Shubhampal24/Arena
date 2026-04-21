const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const postController = require('../controllers/postController');

router.get('/', optionalAuth, postController.getPosts);
router.post('/', protect, postController.createPost);
router.put('/:id/like', protect, postController.likePost);
router.post('/:id/comment', protect, postController.commentOnPost);

module.exports = router;