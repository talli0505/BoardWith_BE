const express = require("express");
const router = express.Router();
const sms = require('../controllers/sms');

router.post('/send', sms.send);
router.post('/verify', sms.verify);

module.exports = router;