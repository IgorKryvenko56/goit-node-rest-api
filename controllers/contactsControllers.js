import { listContacts, getContactById, removeContact, addContact, updateContactById, updateStatusContact } from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js"; 
import validateBody from "../helpers/validateBody.js"; 
import HttpError from "../helpers/HttpError.js"; 

// Middleware to validate request body
const validateRequestBody = (req, res, next) => {
  const { favorite } = req.body;

  if (typeof favorite !== 'boolean') {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  next();
};

export const getAllContacts = async(req, res, next) => {
try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
} catch (error) {
    next(HttpError(500, "Intarnal Server Error"));
}
};

export const getOneContact = async (req, res, next) => {
    const { id } =req.params;
    try {
        const contact =await getContactById(id);
     if (contact) {
        res.status(200).json(contact);
     } else {
        next(HttpError(404, "Not found")); 
     }   
    } catch {
        next(HttpError(500, "Internal Server Error"));
 }
};

export const deleteContact = async(req, res, next) => {
    const { id } = req.params;
    try {
        const deletedContact = await removeContact(id);
        if (deletedContact) {
            res.status(200).json(deletedContact);
        } else {
            next(HttpError(404, "Not found"));
        }
        } catch(error) {
            next(HttpError(500, "Internal Server Error"))
        }
    };

export const createContact = [
    validateBody(createContactSchema),
    async (req, res, next) => {
    const { name, email, phone } = req.body;
    try {
        if (!name || !email || !phone) {
            throw new Error("Name, email, phone are required fields");
        } 
        if (!isValidEmail(email)) {
            throw new Error("Invalid email format");
        }
        const newContact = await addContact(name, email, phone);
        res.status(201).json(newContact);
    } catch (error) {
       next(HttpError(400, error.message));
    }
}
];

export const updateContact = [
    validateBody(updateContactSchema),
    async(req, res, next) => {
        const { id } = req.params;
        const newData = req.body;
        try {
            if (Object.keys(newData).length === 0) {
                throw new Error("Body must have at least one field");
            }
             
        const updatedContact = await updateContactById(id, newData);
        if (updatedContact) {
            res.status(200).json(updatedContact);
        } else {
            next(HttpError(404, "Not found"));
        }  
        } catch (error) {
            next(HttpError(400, error.message));
        }
     }
]; 

 // Update contact favorite status by ID
 export const updateContactFavoriteStatus = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  try {
   // Validate request body
     if (typeof favorite !== 'boolean') {
      return res.status(400).json({ message: 'Invalid request body' });
     }

    const updatedContact = await updateStatusContact(contactId, { favorite });
     if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact favorite status:', error);
    res.status(400).json({ message: 'Failed to update contact favorite status', error: error.message });
  }
};

  export const validateCreateContact = validateBody(createContactSchema);
  export const validateUpdateContact = validateBody(updateContactSchema);

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}