const express = require("express");
const router = express.Router();
const configController = require("../controllers/configController");

router.get("/safe-config", configController.info);
router.get("/safe-crash", configController.crash);

module.exports = router;