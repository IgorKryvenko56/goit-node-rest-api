import Contact from '../models/Contact.js';
import mongoose from 'mongoose';

export async function listContacts(ownerId) {
    try {
        // Fetch contacts where owner is null or matches the provided ownerId
        const contacts = await Contact.find({ $or:[{owner: ownerId}, {owner: null}]});
        return contacts;

    } catch (error) {
        console.error('Error reading contacts:', error);
        throw new Error('Error reading contacts');
    }
}

export async function getContactById(contactId) {
    try {
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return null; // Return early if the contactId is not a valid ObjectId
        }

        const contact = await Contact.findOne({ _id: contactId });
        return contact;
    } catch (error) {
        console.error('Error getting contact by id:', error);
        throw new Error('Error getting contact by id');
    }
}


export async function removeContact(contactId, ownerId) {
    try {
        const deletedContact = await Contact.findOneAndDelete({ _id: contactId, owner: ownerId });
        return deletedContact;

    } catch (error) {
        console.error('Error removing contact:', error);
        throw new Error('Error removing contact');
    }
}

export async function addContact(name, email, phone, ownerId) {
    try {
        const newContact = new Contact({ name, email, phone, owner: ownerId });
        await newContact.save();
        return newContact;
    } catch (error) {
        console.error('Error adding contact:', error);
        throw new Error('Error adding contact'); 
    }
}

export async function updateContactById(contactId, newData, ownerId ) {
    try {
        const updatedContact = await Contact.findOneAndUpdate(
            { _id: contactId, owner: ownerId },
            newData,
            { new: true } 
        );
        return updatedContact; 
    } catch (error) {
        console.error('Error updating contact by id:', error);
        throw new Error('Error updating contact by id');
    }
}

export const updateStatusContact = async (contactId, newData, ownerId) => {
    try {
      const updatedContact = await Contact.findByIdAndUpdate(
        {_id:contactId, owner: ownerId },
        newData,
         { new: true });
  
      return updatedContact;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw new Error('Error updating contact by id');
    }
  };
  
