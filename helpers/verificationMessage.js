const { nanoid } = require("nanoid");

const { MY_EMAIL, BASE_URL } = process.env;
const verificationMessage = (email) => {
  const verificationToken = nanoid();

  const verifyMessage = {
    to: email,
    from: MY_EMAIL,
    subject: "Verification code",
    text: "To verify your account you should click on link bellow",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };

  return { verifyMessage, verificationToken };
};

module.exports = { verificationMessage };
