const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const {
  loginSchema,
  registerSchema,
  subscriptionSchema,
} = require("../schemas/schemas");
const HttpError = require("../middlewares/HttpError");
const { SECRET_KEY } = process.env;

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

module.exports = {
  login,
  registration,
  getCurrent,
  logout,
  changeSubscription,
};
