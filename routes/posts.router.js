const express = require('express');
const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");
const PostsController =require("../controllers/posts");
const postsController = new PostsController();

router.post("/",authMiddleware, postsController.createPosts);
router.get("/", postsController.findAllPosts);
router.get("/randomPost", postsController.randomPost);  //게시글 랜덤 추출
router.get("/:postId", postsController.findOnePost);
router.put("/:postId",authMiddleware, postsController.updatePost);
router.delete("/:postId", authMiddleware, postsController.deletePost)
router.put("/participate/:postId", authMiddleware, postsController.participateMember)
router.put("/confirm/:postId", authMiddleware, postsController.confirmMember)
router.put("/ban/:postId", authMiddleware, postsController.banMember)
router.put("/cancelBan/:postId", authMiddleware, postsController.cancelBanMember)
router.put("/closeParty/:postId", authMiddleware, postsController.closeParty);  //파티원 모집 마감
router.put("/reopenParty/:postId", authMiddleware, postsController.reopenParty);  //파티원 모집 리오픈
router.get("/user/:nickName", authMiddleware, postsController.findPostsByUser) // 자기가 쓴 게시글만 보이게



module.exports = router;