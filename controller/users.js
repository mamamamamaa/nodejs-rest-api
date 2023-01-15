const Jimp = require("jimp");
const path = require("path");

const uploadPath = path.join(__dirname, "../", "public", "avatars");

const changeAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: temporaryName, originalname } = req.file;
  Jimp.read(temporaryName, (err, avatar) => {
    if (err) {
      next(409, err);
    }
    const avatarName = _id + originalname;
    const pathToResizedAvatar = `${uploadPath}/${avatarName}`;
    return avatar.resize(256, 256).write(pathToResizedAvatar);
  });
  res.status(201).json({ message: "Success" });
};

module.exports = { changeAvatar };
