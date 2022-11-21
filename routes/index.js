const express = require("express");
const router = express.Router();

const usersRouter = require("./users.router");
const postsRouter = require("./posts.router");
const commentsRouter = require("./comments.router");
const chatRouter = require("./chat.router");
const kakaoRouter = require("./kakao.router");
const smsRouter = require("./sms.router")

router.use("/chats", chatRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);
router.use("/kakao", kakaoRouter);
router.use("/sms", smsRouter)

module.exports = router;