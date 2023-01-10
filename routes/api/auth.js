const express = require("express");

const router = express.Router();

const authenticate = require("../../middlewares/authenticate");

const {
  login,
  registration,
  changeSubscription,
  getCurrent,
  logout,
} = require("../../controller/auth");

router.post("/login", login);
router.post("/signup", registration);
router.patch("/users", authenticate, changeSubscription);
router.get("/current", authenticate, getCurrent);
router.get("/logout", authenticate, logout);

module.exports = router;
