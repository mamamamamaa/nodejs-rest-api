const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const dataFile = "models/contacts.json";

const updateDataBase = async (updatedContacts) => {
  const jsonData = JSON.stringify(updatedContacts);
  try {
    await fs.writeFile(dataFile, jsonData);
    return true;
  } catch (e) {
    return new Error(e.message);
  }
};

const listContacts = async () => {
  try {
    const data = await fs.readFile(dataFile);
    const contacts = JSON.parse(data.toString());

    return { data: contacts, message: "Contacts found", status: 200 };
  } catch (e) {
    return { message: "Server error", status: 500 };
  }
};

const getContactById = async (contactId) => {
  try {
    const { data: contacts } = await listContacts();
    const id = contactId.toString();
    const [contactById] = contacts.filter((contact) => contact.id === id);

    if (!contactById) {
      return { message: "Not found", status: 404 };
    }

    return { data: contactById, message: "Contact found", status: 200 };
  } catch (e) {
    return { message: "Server error", status: 500 };
  }
};

const removeContact = async (contactId) => {
  try {
    const { data: contacts } = await listContacts();
    const id = contactId.toString();

    const newContacts = contacts.filter((contact) => contact.id !== id);

    if (JSON.stringify(contacts) === JSON.stringify(newContacts)) {
      return { message: "Not found", status: 404 };
    }

    await updateDataBase(newContacts);

    return { data: newContacts, message: "Contact deleted", status: 200 };
  } catch (e) {
    return { message: "Server error", status: 500 };
  }
};

const addContact = async (body) => {
  try {
    const { data: contacts } = await listContacts();
    const newContact = { ...body, id: nanoid() };

    contacts.push(newContact);

    await updateDataBase(contacts);
    return {
      data: newContact,
      message: "Contact successfully added",
      status: 200,
    };
  } catch (e) {
    return { message: "Server error", status: 500 };
  }
};

const updateContact = async (contactId, body = {}) => {
  try {
    const { data: contacts } = await listContacts();
    const id = contactId.toString();
    let updatedContact = {};

    const newContacts = contacts.map((contact) => {
      if (id === contact.id) {
        updatedContact = { ...contact, ...body };
        return updatedContact;
      }
      return contact;
    });

    if (JSON.stringify(contacts) === JSON.stringify(newContacts)) {
      return { message: "Not found", status: 404 };
    }

    await updateDataBase(newContacts);

    return {
      data: updatedContact,
      message: "Contact successfully updated",
      status: 200,
    };
  } catch (e) {
    return { message: "Server error", status: 500 };
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
