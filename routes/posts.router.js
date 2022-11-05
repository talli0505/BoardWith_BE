const express = require('express');
const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");
const PostsController =require("../controllers/posts");
const postsController = new PostsController();

router.post("/",authMiddleware, postsController.createPosts);
router.get("/", postsController.findAllPosts);
router.get("/:_id", postsController.findOnePost);
router.put("/:_id",authMiddleware, postsController.updatePost);
router.delete("/:_id", authMiddleware, postsController.deletePost)


module.exports = router;