const express = require("express");

const router = express.Router();

const {
  addContact,
  updateContact,
  getContactById,
  removeContact,
  listContacts,
} = require("../../controller/contact.js");
const { updateStatusContact } = require("../../controller/contact");

router.get("/", listContacts);

router.get("/:contactId", getContactById);

router.post("/", addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", updateContact);

router.patch("/:contactId/favorite", updateStatusContact);

module.exports = router;
