const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { loginSchema, registerSchema } = require("../schemas/schemas");
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

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });
    console.log(newUser);
    res.status(201).json({
      message: "Success",
      data: { subscription: newUser.subscription, email: newUser.email },
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

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      next(409, "Invalid email or password");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "8h" });

    res.json({
      message: "Success",
      status: 201,
      data: {
        token,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    next(HttpError(500));
  }
};

module.exports = { login, registration };
