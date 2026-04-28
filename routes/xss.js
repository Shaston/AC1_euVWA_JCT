const express = require("express");
const router = express.Router();

const controller = require("../controllers/xssController");

router.get("/reflected", controller.reflected);
router.get("/reflected-safe", controller.reflectedSafe);

router.get("/stored", controller.storedForm);
router.post("/stored", controller.stored);

router.get("/stored-safe", controller.storedSafeForm);
router.post("/stored-safe", controller.storedSafe);

module.exports = router;