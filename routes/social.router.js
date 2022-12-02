require("dotenv").config();
const express = require('express');
const router = express.Router();

const SoicalController = require('../controllers/social');
const soicalController = new SoicalController();

router.post('/google/isGoogle', soicalController.isGoogle);

router.post('/google/callback', soicalController.google_callback);

router.post('/kakao/isKaKao', soicalController.isKakao);

router.post('/kakao/callback', soicalController.kakao_callback);

router.post('/naver/isNaver', soicalController.isNaver);

router.post('/naver/callback', soicalController.naver_callback);

module.exports = router;