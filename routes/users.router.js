const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");
const middleware = require("../middleware/auth-middleware");
const usersController = new UsersController();

// 회원가입
router.post("/signup", usersController.signUp);

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

module.exports = router;
