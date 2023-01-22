const Jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;
const User = require("../models/user");
const HttpError = require("../middlewares/HttpError");

const uploadPath = path.join(__dirname, "../", "public", "avatars");

const changeAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: temporaryName, originalname } = req.file;
  await Jimp.read(temporaryName)
    .then((avatar) => {
      return avatar.resize(250, 250).write(temporaryName);
    })
    .catch((err) => next(409, err));

  const fileName = `${_id}_${originalname}`;
  const pathToResizedAvatar = path.join(uploadPath, fileName);

  await fs.rename(temporaryName, pathToResizedAvatar);

  const avatarURL = path.join("avatar", fileName);

  try {
    await User.findByIdAndUpdate(_id, { avatarURL });
  } catch {
    next(HttpError(500));
  }

  res.status(201).json({ avatarURL });
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;

  const isRegister = await User.findOneAndUpdate(verificationToken, {
    verificationToken: null,
    verify: true,
  });

  if (!isRegister) {
    next(HttpError(404, "User not found"));
  }

  res.status(200).json({ message: "Verification successful" });
};

module.exports = { changeAvatar, verify };
