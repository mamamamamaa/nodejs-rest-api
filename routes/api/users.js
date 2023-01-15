const express = require("express");
const multer = require("multer");
const authenticate = require("../../middlewares/authenticate");
const { changeAvatar } = require("../../controller/users");
const path = require("path");

const router = express.Router();
const multerConfig = multer.diskStorage({
  destination: path.join(__dirname, "../", "../", "temp"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});
router.patch("/avatars", authenticate, upload.single("avatar"), changeAvatar);

module.exports = router;
