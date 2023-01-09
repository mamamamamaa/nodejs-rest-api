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

const authenticate = require("../../middlewares/authenticate");

router.get("/", authenticate, listContacts);

router.get("/:contactId", authenticate, getContactById);

router.post("/", authenticate, addContact);

router.delete("/:contactId", authenticate, removeContact);

router.put("/:contactId", authenticate, updateContact);

router.patch("/:contactId/favorite", authenticate, updateStatusContact);

module.exports = router;
