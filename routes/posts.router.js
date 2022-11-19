const express = require('express');
const router = express.Router();
const Posts = require("../schema/posts")

const authMiddleware = require("../middleware/auth-middleware");
const PostsController =require("../controllers/posts");
const postsController = new PostsController();

router.post("/",authMiddleware, postsController.createPosts);
router.get("/search/:keyword", postsController.searchPost);  //키워드(제목, 닉네임)로 게시글 검색
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
router.get("/user/:nickName", authMiddleware, postsController.findPostsByUser); // 자기가 쓴 게시글만 보이게
router.put("/bookmark/:postId", authMiddleware, postsController.pushBookmark); // 북마크
router.get("/bookmark/:nickName", authMiddleware, postsController.getBookmark);


module.exports = router;