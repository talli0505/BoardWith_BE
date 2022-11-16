const express = require("express");
const router = express.Router();

const usersRouter = require("./users.router");
const postsRouter = require("./posts.router");
const commentsRouter = require("./comments.router");
const chatRouter = require("./chat.router");

router.use("/chats", chatRouter);
router.use("/users", usersRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);

module.exports = router;