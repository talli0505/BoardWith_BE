const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");
const middleware = require("../middleware/auth-middleware");
const authMiddleware = require("../middleware/auth-middleware");
const usersController = new UsersController();

// 회원가입
router.post("/signup", usersController.signUp);

// 유저 id 중복 검사
router.post("/Dup/Id", usersController.findDupId)

// 유저 nickName 중복 검사
router.post("/Dup/Nick", usersController.findDupNick);

// 로그인
router.post("/login", usersController.login);

// 다른 유저 정보보기
router.get("/:nickName", usersController.lookOtherUser);

// 내 정보 확인하기
router.get("/", middleware, usersController.findUser);

// 정보 수정하기
router.put("/", middleware, usersController.updateUserData);

// 회원 탈퇴하기
router.delete("/", middleware, usersController.deleteUserData);

// 비밀번호 변경하기
router.post("/change/password", usersController.changePW);

// 출석체크 버튼식
router.put("/check", middleware, usersController.loginCheck);

// refresh_token 체크 후 access 전달
router.post("/refresh", usersController.refreshT);

// 북마크 등록
router.put("/bookmark/bookmark", authMiddleware, usersController.pushBookmark);

//북마크 가져오기
router.get("/bookmark/:nickName", authMiddleware, usersController.getBookmark);

module.exports = router;