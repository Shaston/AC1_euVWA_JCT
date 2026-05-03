const express = require("express");
const router = express.Router();
const sensitiveController = require("../controllers/sensitiveController");

router.get("/sensitive-safe/profile", sensitiveController.profile);

module.exports = router;