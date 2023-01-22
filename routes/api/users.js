const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const { changeAvatar, verify } = require("../../controller/users");
const { upload } = require("../../middlewares/multer");

const router = express.Router();

router.patch("/avatars", authenticate, upload.single("avatar"), changeAvatar);
router.get("/verify/:verificationToken", verify);

module.exports = router;
