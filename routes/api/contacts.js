const express = require("express");

const Joi = require("joi");

const router = express.Router();

const {
  addContact,
  updateContact,
  getContactById,
  removeContact,
  listContacts,
} = require("../../models/contacts.js");

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
});

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
}).and("name", "email", "phone");

router.get("/", async (req, res, next) => {
  const response = await listContacts();

  res.json(response);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const response = await getContactById(contactId);

  res.json(response);
});

router.post("/", async (req, res, next) => {
  const { error, value } = addContactSchema.validate(req.body);

  if (error) {
    res.json({
      message: "Missing required name field or invalid values",
      status: 404,
    });
    return;
  }

  const response = await addContact(value);

  res.json(response);
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const response = await removeContact(contactId);

  res.json(response);
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { error, value } = updateContactSchema.validate(req.body);

  if (error) {
    res.json({ message: "Missing fields or invalid values", status: 404 });
    return;
  }

  const response = await updateContact(contactId, value);

  res.json(response);
});

module.exports = router;
