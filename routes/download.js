const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/downloadController");

router.get("/download", downloadController.form);
router.post("/download", downloadController.run);

module.exports = router;