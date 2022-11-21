const express = require("express");
const router = express.Router();
const sms = require('../controllers/sms');

router.post('/send', sms.send);
router.post('/verify', sms.verify);

router.post('/sendID', sms.sendID);
router.post('/verifyID', sms.verifyID);

router.post('/sendPW', sms.sendPW);

module.exports = router;