const express = require("express");

const router = express.Router();

const { login, registration } = require("../../controller/auth");

router.post("/login", login);
router.post("/register", registration);

module.exports = router;
