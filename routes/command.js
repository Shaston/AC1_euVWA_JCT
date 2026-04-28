const express = require("express");
const router = express.Router();

const controller = require("../controllers/commandController");

router.get("/cmd", controller.form);
router.post("/cmd", controller.vulnerable);

router.get("/cmd-safe", controller.formSafe);
router.post("/cmd-safe", controller.safe);

module.exports = router;