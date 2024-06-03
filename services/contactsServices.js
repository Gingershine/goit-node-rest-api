import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const contactsPath = path.resolve('db', 'contacts.json');

async function readContacts() {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);    
}

async function writeContacts(data) {
    await fs.writeFile(contactsPath, JSON.stringify(data, undefined,2));
}

async function listContacts() {
const contacts = await readContacts();
return contacts;    
  }
  
  async function getContactById(contactId) {   
    const contacts = await readContacts();
    const contact = contacts.find(contact => contact.id === contactId);
    if (typeof contact === 'undefined') return null;
    return contact;
  }
  
  async function removeContact(contactId) {
    const contacts = await readContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) return null;
    const removedContact = contacts[index];
    contacts.splice(index, 1);
    await writeContacts(contacts);
    return removedContact;
  }
  
  async function addContact(name, email, phone) {    
    const contacts = await readContacts();
    const contact = {
        id: crypto.randomUUID(),
        name,
        email,
        phone,
    };
    contacts.push(contact);
    await writeContacts(contacts);
    return contact;
  }

  async function updateContact(id, data) {
    const contacts = await readContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) return null;
    const updatedContact = {...contacts[index], ...data};    
    contacts[index] = updatedContact;
    await writeContacts(contacts);
    return updatedContact;
  }

  export default {
      listContacts,
      getContactById,
      removeContact,
      addContact,
      updateContact,
  };