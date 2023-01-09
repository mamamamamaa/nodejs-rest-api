const Joi = require("joi");

const emailRegEx =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string()
    .pattern(
      // eslint-disable-next-line prefer-regex-literals
      new RegExp("^\\(?(\\d{3})\\)?[- ]?(\\d{3})[- ]?(\\d{4})$")
    )
    .required(),
  favorite: Joi.boolean(),
}).required();

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().pattern(
    // eslint-disable-next-line prefer-regex-literals
    new RegExp("^\\(?(\\d{3})\\)?[- ]?(\\d{3})[- ]?(\\d{4})$")
  ),
  favorite: Joi.boolean(),
}).required();

const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
}).required();

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegEx).required(),
  password: Joi.string().min(8).max(18).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegEx).required(),
  password: Joi.string().min(8).max(18).required(),
});

module.exports = {
  addContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
  loginSchema,
  registerSchema,
};
