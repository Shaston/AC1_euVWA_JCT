const express = require("express");
const router = express.Router();

const controller = require("../controllers/fileController");

router.get("/file", controller.form);
router.post("/file", controller.vulnerable);

router.get("/file-safe", controller.formSafe);
router.post("/file-safe", controller.safe);

module.exports = router;