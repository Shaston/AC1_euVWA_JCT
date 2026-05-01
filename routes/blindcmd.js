const express = require("express");
const router = express.Router();
const blindCmdController = require("../controllers/blindCmdController");

router.get("/blindcmd", blindCmdController.form);
router.post("/blindcmd", blindCmdController.run);

router.get("/blindcmd-safe", blindCmdController.form);
router.post("/blindcmd-safe", blindCmdController.run);

module.exports = router;