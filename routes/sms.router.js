const express = require("express");
const router = express.Router();
const SMS = require('../controllers/sms');
// const sms = new SMS();

// 회원가입 시 사용
router.post('/send', SMS.send);
router.post('/verify', SMS.verify);

// 아이디 찾을 때 사용
router.post('/sendID', SMS.sendID);
router.post('/verifyID', SMS.verifyID);

// 비밀번호 변경할때 사용
router.post('/sendPW', SMS.sendPW);

module.exports = router;