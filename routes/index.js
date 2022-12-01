const express = require("express");
const router = express.Router();

const usersRouter = require("./users.router");
const postsRouter = require("./posts.router");
const commentsRouter = require("./comments.router");
const chatRouter = require("./chat.router");
const kakaoRouter = require("./kakao.router");
const googleRouter = require("./google.router");
const smsRouter = require("./sms.router")
const rankRouter = require("./rank.router")


router.use("/chats", chatRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);
router.use("/kakao", kakaoRouter);
router.use("/google", googleRouter);
router.use("/sms", smsRouter)
router.use("/rank", rankRouter)

module.exports = router;