const Contact = require("../models/contact");
const {
  addContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} = require("../schemas/schemas");

const listContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (e) {
    return res.json({ message: "Server error", status: 500 });
  }
};

const getContactById = async (req, res) => {
  try {
    const { contactId: id } = req.params;
    const contact = await Contact.findById(id);

    res.json({ data: contact, message: "Contact found", status: 200 });
  } catch (e) {
    res.json({ message: "Not found", status: 404 });
  }
};

const removeContact = async (req, res) => {
  try {
    const { contactId: id } = req.params;

    const removedContact = await Contact.findByIdAndRemove(id);

    if (!removedContact) {
      res.json({ message: "Not found", status: 404 });
    }

    res.json({ data: removedContact, message: "Contact deleted", status: 200 });
  } catch (e) {
    res.json({ message: "Not found", status: 404 });
  }
};

const addContact = async (req, res) => {
  try {
    const { error, value } = addContactSchema.validate(req.body);

    if (error) {
      res.json({
        message: "Missing required name field or invalid values",
        status: 404,
      });
      return;
    }

    const newContact = await Contact.create({ favorite: false, ...value });

    res.json({
      data: newContact,
      message: "Contact successfully added",
      status: 200,
    });
  } catch (e) {
    res.json({ message: "Server error", status: 500 });
  }
};

const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { error, value } = updateContactSchema.validate(req.body);

    if (error) {
      res.json({ message: "Missing fields or invalid values", status: 404 });
      return;
    }

    const oldContact = await Contact.findOneAndUpdate(
      { _id: contactId },
      value
    );

    res.json({
      data: oldContact,
      message: "Contact successfully updated",
      status: 200,
    });
  } catch (e) {
    res.json({ message: "Not found", status: 404 });
  }
};

const updateStatusContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { error, value } = updateStatusContactSchema.validate(req.body);

    if (error) {
      res.json({ message: "Missing field favorite", status: 400 });
      return;
    }

    const oldStatus = await Contact.findOneAndUpdate({ _id: contactId }, value);

    res.json({
      data: oldStatus,
      message: "Status successfully updated",
      status: 200,
    });
  } catch (e) {
    res.json({ message: "Not found", status: 404 });
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
