const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { loginSchema, registerSchema } = require("../schemas/schemas");
const { SECRET_KEY } = process.env;

const registration = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      res.json({
        message: "Invalid values",
        status: 404,
      });
      return;
    }

    const { email, password } = value;

    const user = User.findOne({ email });

    if (user) {
      res.json({ message: "Email in use", status: 409 });
      return;
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.json({
      message: "Success",
      status: 201,
      data: { name: newUser.name, email: newUser.email },
    });
  } catch (e) {
    res.json({ message: "Server error", status: 500 });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      res.json({
        message: "Invalid values",
        status: 404,
      });
      return;
    }

    const { email, password } = value;

    const user = User.findOne({ email });

    if (!user) {
      res.json({ message: "Invalid email or password", status: 409 });
      return;
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      res.json({ message: "Invalid email or password", status: 409 });
      return;
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
    res.json({ message: "Server error", status: 500 });
  }
};

module.exports = { login, registration };
