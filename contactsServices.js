import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactsPath = join(__dirname, 'contacts.json');


export async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading contacts:', error);
        return [];
    }
}

export async function getContactById(contactId) {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        const contacts = JSON.parse(data);
        return contacts.find(contact => contact.id === contactId) || null;
    } catch (error) {
        console.error('Error getting contact by id:', error);
        return null;
    }
}

export async function removeContact(contactId) {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        let contacts = JSON.parse(data);

        const index = contacts.findIndex(contact => contact.id === contactId);
        if (index !== -1) {
            const removedContact = contacts.splice(index, 1)[0];
            await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
            return removedContact;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error removing contact:', error);
        return null;
    }
}

export async function addContact(name, email, phone) {
    try {
        const data = await fs.readFile(contactsPath, 'utf-8');
        let contacts = JSON.parse(data);
        const newContact = { id: Date.now(), name, email, phone };
        contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return newContact;
    } catch (error) {
        console.error('Error adding contact:', error);
        return null;
    }
}

export async function updateContactById(id, newData) {
    try {
        let contacts = await listContacts();
        const contactIndex = contacts.findIndex(item => item.id === id);
        if (contactIndex === -1) {
            return null;
        }
        contacts[contactIndex] = { ...contacts[contactIndex], ...newData };
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return contacts[contactIndex];
    } catch (error) {
        console.error('Error updating contact by id:', error);
        return null;
    }
}


