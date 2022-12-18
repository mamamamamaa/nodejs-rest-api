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
}).required();

router.get("/", async (req, res, next) => {
  const data = await listContacts();

  const response = data
    ? { data, message: "Success", status: 200 }
    : { message: "Server problem", status: 500 };

  res.json(response);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  const data = await getContactById(contactId);

  const response = data
    ? { data, message: "Success", status: 200 }
    : { message: "Not found", status: 404 };

  res.json(response);
});

router.post("/", async (req, res, next) => {
  const { error, value } = addContactSchema.validate(req.body);

  if (error) {
    res.json({ message: "Missing required name field", status: 404 });
    return;
  }

  const data = await addContact(value);

  const response = data
    ? { data, message: "Success", status: 200 }
    : { message: "Server problem", status: 500 };

  res.json(response);
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const data = await removeContact(contactId);

  const response = data
    ? { data, message: "Success", status: 200 }
    : { message: "Server problem", status: 500 };

  res.json(response);
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { error, value } = updateContactSchema.validate(req.body);

  if (error) {
    res.json({ message: "Should be at least one of fields", status: 404 });
    return;
  }

  const data = await updateContact(contactId, value);

  const response = data
    ? { data, message: "Success", status: 200 }
    : { message: "Server problem", status: 500 };

  res.json(response);
});

module.exports = router;
