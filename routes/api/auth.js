const express = require("express");

const router = express.Router();

const authenticate = require("../../middlewares/authenticate");

const { upload } = require("../../middlewares/multer");
const {
  login,
  registration,
  changeSubscription,
  getCurrent,
  logout,
  changeAvatar,
  verify,
  reverify,
} = require("../../controller/auth");

router.post("/login", login);
router.post("/signup", registration);

router.patch("/users", authenticate, changeSubscription);
router.get("/current", authenticate, getCurrent);
router.get("/logout", authenticate, logout);
router.patch("/avatars", authenticate, upload.single("avatar"), changeAvatar);
router.get("/verify/:verificationToken", verify);
router.post("/verify", reverify);

module.exports = router;
