const express = require("express");
const router = express.Router();
const domXssController = require("../controllers/domXssController");

router.get("/", domXssController.form);

module.exports = router;