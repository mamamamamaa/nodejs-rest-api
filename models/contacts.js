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
    return JSON.parse(data.toString());
  } catch (e) {
    return new Error(e.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const id = contactId.toString();
    const [contactById] = contacts.filter((contact) => contact.id === id);
    return contactById;
  } catch (e) {
    return new Error(e.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const id = contactId.toString();

    const newContacts = contacts.filter((contact) => contact.id !== id);

    if (JSON.stringify(contacts) !== JSON.stringify(newContacts)) {
      await updateDataBase(newContacts);
    }

    return newContacts;
  } catch (e) {
    return new Error(e.message);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    const newContact = { ...body, id: nanoid() };

    contacts.push(newContact);

    await updateDataBase(contacts);
    return newContact;
  } catch (e) {
    return new Error(e.message);
  }
};

const updateContact = async (contactId, body = {}) => {
  // const isEmpty = Object.keys(body).length === 0 && body.constructor === Object;
  //
  // if (isEmpty) {
  //   return "Not found";
  // }

  try {
    const contacts = await listContacts();
    const id = contactId.toString();
    let updatedContact = {};

    const newContacts = contacts.map((contact) => {
      if (id === contact.id) {
        updatedContact = { ...contact, ...body };
        return updatedContact;
      }
      return contact;
    });

    await updateDataBase(newContacts);

    return updatedContact;
  } catch (e) {
    return new Error(e.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
