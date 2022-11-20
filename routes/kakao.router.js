require("dotenv").config();
const express = require('express');
const router = express.Router();

const kakaoController = require('../controllers/kakao');

router.post('/callback', kakaoController.kakao_callback);

module.exports = router;