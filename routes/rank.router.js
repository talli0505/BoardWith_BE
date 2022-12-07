const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");

const RanksController =require("../controllers/ranks");
const ranksController = new RanksController();

router.get("/", ranksController.getRanks);
router.get("/mypoint", authMiddleware, ranksController.getMyPoint)

module.exports = router