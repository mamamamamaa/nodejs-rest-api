const { Contact } = require("../models/contact");

const {
  addContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} = require("../schemas/schemas");
const HttpError = require("../middlewares/HttpError");

const listContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  try {
    const contacts = await Contact.find(
      { owner },
      "-createdAt -updatedAt"
    ).populate("owner", "email");
    res.json(contacts);
  } catch (e) {
    next(HttpError(500));
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId: id } = req.params;

    const contact = await Contact.findById(id);

    res.status(200).json({ data: contact, message: "Contact found" });
  } catch (e) {
    next(HttpError(404));
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId: id } = req.params;

    const removedContact = await Contact.findByIdAndRemove(id);

    if (!removedContact) {
      next(HttpError(404));
    }

    res.status(200).json({ data: removedContact, message: "Contact deleted" });
  } catch (e) {
    next(HttpError(404));
  }
};

const addContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { error, value } = addContactSchema.validate(req.body);

    if (error) {
      next(HttpError(404, "Missing required name field or invalid values"));
    }

    const isExistContact = await Contact.findOne({ owner, email: value.email });

    if (isExistContact) {
      next(HttpError(409, "This contact is already exist"));
    }

    const newContact = await Contact.create({
      ...value,
      owner,
    });

    res.status(200).json({
      data: newContact,
      message: "Contact successfully added",
    });
  } catch (e) {
    console.log(e.message);
    next(HttpError(500));
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error, value } = updateContactSchema.validate(req.body);

    if (error) {
      next(HttpError(404, "Missing fields or invalid values"));
    }

    const oldContact = await Contact.findOneAndUpdate(
      { _id: contactId },
      value
    );

    res.status(200).json({
      data: oldContact,
      message: "Contact successfully updated",
    });
  } catch (e) {
    next(HttpError(404));
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error, value } = updateStatusContactSchema.validate(req.body);

    if (error) {
      next(HttpError(400, "Missing field favorite"));
    }

    const oldStatus = await Contact.findOneAndUpdate({ _id: contactId }, value);

    res.status(200).json({
      data: oldStatus,
      message: "Status successfully updated",
    });
  } catch (e) {
    next(HttpError(404));
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
