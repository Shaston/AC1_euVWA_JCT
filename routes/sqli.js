const express = require("express");
const router = express.Router();
const sqliController = require("../controllers/sqliController");

router.get("/sqli-login", sqliController.form);
router.post("/sqli-login", sqliController.login);

module.exports = router;