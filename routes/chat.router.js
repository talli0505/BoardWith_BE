const express = require("express");
const router = express.Router();

const ChatController = require("../controllers/chats")
const chatController = new ChatController();

// 방에 있는 내용 불러오기
router.get('/:room', chatController.updateSocket);

module.exports = router;
