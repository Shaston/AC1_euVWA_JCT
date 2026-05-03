const express = require("express");
const router = express.Router();
const configController = require("../controllers/configController");

router.get("/debug-config", configController.debug);
router.get("/debug-crash", configController.crash);

module.exports = router;