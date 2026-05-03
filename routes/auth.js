const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/auth-vul/login", authController.form);
router.post("/auth-vul/login", authController.login);
router.get("/auth-vul/panel", authController.panel);

module.exports = router;