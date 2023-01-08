const express = require("express");

const router = express.Router();

const {
  addContact,
  updateContact,
  getContactById,
  removeContact,
  listContacts,
  updateStatusContact,
} = require("../../controller/contact.js");

router.get("/", listContacts);

router.get("/:contactId", getContactById);

router.post("/", addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", updateContact);

router.patch("/:contactId/favorite", updateStatusContact);

module.exports = router;
