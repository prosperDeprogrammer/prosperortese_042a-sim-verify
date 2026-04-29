const express = require("express");
const router = express.Router();
const apiKeyController = require("../controllers/apiKeyController");

router.post("/", apiKeyController.provisionKey);

module.exports = router;
