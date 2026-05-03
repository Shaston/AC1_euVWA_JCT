const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");

router.get("/upload-vul", uploadController.form);
router.post("/upload-vul", uploadController.middleware, uploadController.upload);

router.get("/upload-safe", uploadController.form);
router.post("/upload-safe", uploadController.middleware, uploadController.upload);

module.exports = router;