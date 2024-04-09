import mongoose from 'mongoose';
import Contact from '../models/contact.js';

// Get all contacts
export const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    console.error('Error listing contacts:', error);
    return [];
  }
};

// Get contact by ID
export const getContactById = async (contactId) => {
  try {
    return await Contact.findById(contactId);
  } catch (error) {
    console.error('Error getting contact by id:', error);
    return null;
  }
};

// Add new contact
export const addContact = async (name, email, phone) => {
  try {
    const newContact = new Contact({ name, email, phone });
    return await newContact.save();
  } catch (error) {
    console.error('Error adding contact:', error);
    return null;
  }
};

// Update contact by ID
export const updateContactById = async (contactId, newData) => {
  try {
    return await Contact.findByIdAndUpdate(contactId, newData, { new: true });
  } catch (error) {
    console.error('Error updating contact by ID:', error);
    return null;
  }
};

export const updateStatusContact = async (contactId, newData) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, newData, { new: true });

    return updatedContact;
  } catch (error) {
    console.error('Error updating contact:', error);
    return null;
  }
};

// Remove contact by ID
export const removeContact = async (contactId) => {
  try {
    const result = await Contact.findByIdAndDelete(new mongoose.Types.ObjectId(contactId));
    if (!result) {
      throw new Error('Contact not found');
    }
    return result
  } catch (error) {
    console.error('Error removing contact:', error);
    return null;
  }
};







