import { listContacts, getContactById, removeContact, addContact, updateContactById } from "../services/contactsServices.js";
import { createContactSchema, 
         updateContactSchema } from "../schemas/contactsSchemas.js"; 
import validateBody from "../helpers/validateBody.js"; 
import HttpError from "../helpers/HttpError.js"; 
import { verifyContactOwner } from "../middleware/verifyOwner.js";
import isValidEmail from "../helpers/validation.js";
       

export const getAllContacts = async(req, res, next) => {
try {
    const ownerId = req.user && req.user._id;
    if (!ownerId) {
        return next(HttpError(401, 'User not authenticated or missing user ID'));
      }
      
    const contacts = await listContacts(ownerId);
    res.status(200).json(contacts);
} catch (error) {
    console.error('Error in getAllContacts:', error);
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

     //if (contact) {
         // Ensure the user is authorized to access this contact
         if (contact.owner.toString() !== ownerId) {
            return res.status(403).json({ message: 'Unauthorized to access this contact' });
          }    
        res.status(200).json(contact);
        
    } catch {
        next(HttpError(500, "Internal Server Error"));
 }
};

export const deleteContact = [verifyContactOwner, async(req, res, next) => {
    const { id } = req.params;
    const ownerId = req.user && req.user._id;
    try {
        const deletedContact = await removeContact(id, ownerId);

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
    console.log('Incoming request body:', req.body); // Log the incoming request body
    console.log('Extracted ownerId from token:', ownerId); // Log the extracted ownerId from token

    try {
      const isValid = isValidEmail(email); // Validate email format
      if (!isValid) {
        throw new Error("Invalid email format");
      }
      const ownerId = req.user._id;
console.log('OwnerId extracted from token:', ownerId); // Log the ownerId before calling addContact
        const newContact = await addContact(name, email, phone, ownerId);
        console.log('New contact created:', newContact); // Log the newly created contact
        res.status(201).json(newContact);
    } catch (error) {
       console.error('Error creating contact:', error);
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
        const ownerId = req.user && req.user._id;
        try {
            if (Object.keys(newData).length === 0) {
                throw new Error("Body must have at least one field");
            }
             
        const updatedContact = await updateContactById(id, newData, ownerId);

        if (!updatedContact) {
            return next(HttpError(404, "Contact not found"));
          }
      
          res.status(200).json(updatedContact);
        } catch (error) {
            next(HttpError(400, error.message));
        }
     }
]; 

