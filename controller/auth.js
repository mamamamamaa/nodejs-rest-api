const User = require("../models/user");
const Jimp = require("jimp");
const HttpError = require("../middlewares/HttpError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const sgMail = require("@sendgrid/mail");

const {
  loginSchema,
  registerSchema,
  subscriptionSchema,
} = require("../schemas/schemas");

const { SECRET_KEY, SENDGRID_API_KEY, MY_EMAIL, BASE_URL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const registration = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      next(404, error);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      next(409, "Email in use");
    }

    const hashPassword = await bcrypt.hashSync(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const verifyMessage = {
      to: email,
      from: MY_EMAIL,
      subject: "Verification code",
      text: "To verify your account you should click on link bellow",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
    };

    await sgMail.send(verifyMessage);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    res.status(201).json({
      message: "Success",
      data: {
        subscription: newUser.subscription,
        email: newUser.email,
      },
    });
  } catch (e) {
    next(HttpError(500));
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      next(404, error);
      return;
    }

    const { email, password } = value;

    const user = await User.findOne({ email });

    if (!user) {
      next(409, "Invalid email or password");
    }

    if (!user.verify) {
      next(409, "You are not verified");
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      next(409, "Invalid email or password");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "8h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      message: "Success",
      status: 201,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(HttpError(500));
  }
};

const changeSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { error, value } = subscriptionSchema.validate(req.body);

  if (error) {
    next(HttpError(409, "Invalid type of subscription"));
  }

  await User.findByIdAndUpdate(_id, value);

  res.status(201).json({ message: "Success" });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(201).json({ message: "Logout success" });
};

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

  const user = await User.findOne({ verificationToken });

  if (!user) {
    next(HttpError(404, "User not found"));
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  res.status(200).json({ message: "Verification successful" });
};

module.exports = {
  login,
  registration,
  getCurrent,
  logout,
  changeSubscription,
  changeAvatar,
  verify,
};
