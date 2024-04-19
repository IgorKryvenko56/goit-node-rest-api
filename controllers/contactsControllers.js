import { listContacts, getContactById, removeContact, addContact, updateContactById } from "../services/contactsServices.js";
import { createContactSchema, 
         updateContactSchema } from "../schemas/contactsSchemas.js"; 
import validateBody from "../helpers/validateBody.js"; 
import HttpError from "../helpers/HttpError.js"; 
import { verifyContactOwner } from "../middleware/verifyOwner.js";
        

export const getAllContacts = async(req, res, next) => {
try {
    const contacts = await listContacts(req.user._id);
    res.status(200).json(contacts);
} catch (error) {
    next(HttpError(500, "Internal Server Error"));
}
};

export const getOneContact = async (req, res, next) => {
    const { id } =req.params;
    const ownerId = req.user._id;

    try {
        const contact = await getContactById(id, ownerId);

        if (!contact) {
          return next(HttpError(404, 'Contact not found'));
        }

     if (contact) {
         // Ensure the user is authorized to access this contact
         if (contact.owner.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized to access this contact' });
          }    
        res.status(200).json(contact);
     } else {
        next(HttpError(404, "Not found")); 
     }   
    } catch {
        next(HttpError(500, "Internal Server Error"));
 }
};

export const deleteContact = [verifyContactOwner, async(req, res, next) => {
    const { id } = req.params;
    try {
        const deletedContact = await removeContact(id);

        if (!deletedContact) {
            return next(HttpError(404, "Contact not found"));
          }
      
          res.status(200).json(deletedContact);
       
        } catch(error) {
            next(HttpError(500, "Internal Server Error"))
        }
    }
];

export const createContact = [
    validateBody(createContactSchema),
    async (req, res, next) => {
    const { name, email, phone } = req.body;
    const ownerId = req.user._id;
    try {
        if (!name || !email || !phone) {
            throw new Error("Name, email, phone are required fields");
        } 
        if (!isValidEmail(email)) {
            throw new Error("Invalid email format");
        }
        const newContact = await addContact(name, email, phone, ownerId);
        res.status(201).json(newContact);
    } catch (error) {
       next(HttpError(400, error.message));
    }
}
];

export const updateContact = [
    verifyContactOwner, 
    validateBody(updateContactSchema),
    async(req, res, next) => {
        const { id } = req.params;
        const newData = req.body;
        try {
            if (Object.keys(newData).length === 0) {
                throw new Error("Body must have at least one field");
            }
             
        const updatedContact = await updateContactById(id, newData);

        if (!updatedContact) {
            return next(HttpError(404, "Contact not found"));
          }
      
          res.status(200).json(updatedContact);
        } catch (error) {
            next(HttpError(400, error.message));
        }
     }
]; 

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}