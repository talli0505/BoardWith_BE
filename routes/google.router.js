require("dotenv").config();
const express = require('express');
const router = express.Router();

const googleController = require('../controllers/google');

router.post('/isGoogle', googleController.isGoogle);

router.post('/callback', googleController.google_callback);

module.exports = router;