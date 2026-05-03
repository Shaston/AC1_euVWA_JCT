const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/auth-safe/login", authController.form);
router.post("/auth-safe/login", authController.login);
router.get("/auth-safe/panel", authController.panel);
router.get("/auth-safe/logout", authController.logout);

module.exports = router;