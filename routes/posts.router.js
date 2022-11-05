const express = require('express');
const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");
const PostsController =require("../controllers/posts");
const postsController = new PostsController();

router.post("/",authMiddleware, postsController.createPosts);
router.get("/", postsController.findAllPosts);
router.get("/:postId", postsController.findOnePost);
router.put("/:postId",authMiddleware, postsController.updatePost);
router.delete("/:postId", authMiddleware, postsController.deletePost)


module.exports = router;