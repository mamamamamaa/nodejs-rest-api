const User = require("../models/user");
const { loginSchema, registerSchema } = require("../schemas/schemas");
const bcrypt = require("bcryptjs");

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

    const user = User.findOne(email);

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

const login = async (req, res) => {};

module.exports = { login, registration };
