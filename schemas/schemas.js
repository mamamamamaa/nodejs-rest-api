const Joi = require("joi");

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

module.exports = {
  addContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
};
