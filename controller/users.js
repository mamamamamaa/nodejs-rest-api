const Jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;
const User = require("../models/user");

const uploadPath = path.join(__dirname, "../", "public", "avatars");

const changeAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: temporaryName, originalname } = req.file;
  console.log(temporaryName);
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
    next(500);
  }

  res.status(201).json({ avatarURL });
};

module.exports = { changeAvatar };
