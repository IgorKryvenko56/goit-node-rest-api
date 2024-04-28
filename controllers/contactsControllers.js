import { listContacts, getContactById, removeContact, addContact, updateContactById } from "../services/contactsServices.js";
import { createContactSchema, 
         updateContactSchema } from "../schemas/contactsSchemas.js"; 
import validateBody from "../helpers/validateBody.js"; 
import HttpError from "../helpers/HttpError.js"; 
import { verifyContactOwner } from "../middleware/verifyOwner.js";
import isValidEmail from "../helpers/validation.js";
import Contact from '../models/Contact.js'; // Import the Contact model
      

export const getAllContacts = async(req, res, next) => {
try {
    console.log('User info:', req.user);
    const ownerId = req.user && req.user.userId;

    if (!ownerId) {
      // If ownerId is missing or undefined, return a 401 Unauthorized error
      return next(HttpError(401, 'User not authenticated or missing user ID'));
    }
    // Retrieve all contacts where the owner is not specified (null or undefined)
    const contacts = await Contact.find({ owner: { $exists: false } });
   //const contacts = await listContacts(ownerId);
    res.status(200).json(contacts);
} catch (error) {
    console.error('Error in getAllContacts:', error);
    next(HttpError(500, "Internal Server Error"));
}
};

export const getOneContact = async (req, res, next) => {
    const { id } =req.params;
    //const ownerId = req.user.userId;

    try {
        const contact = await getContactById(id);

        if (!contact) {
          return next(HttpError(404, 'Contact not found'));
        }
        // Log contact owner and current user's ID for comparison
    //console.log('Contact owner:', contact.owner);
    //console.log('Current user ID:', ownerId);

     //if (contact) {
         // Ensure the user is authorized to access this contact
         //if (contact.owner.toString() !== ownerId) {
           // return res.status(403).json({ message: 'Unauthorized to access this contact' });}    
        res.status(200).json(contact);
        
    } catch {
        next(HttpError(500, "Internal Server Error"));
 }
};

export const deleteContact = [verifyContactOwner, async(req, res, next) => {
    const { id } = req.params;
    const ownerId = req.user && req.user.userId;
    try {
        const deletedContact = await removeContact(id, ownerId);

        if (!deletedContact) {
            return next(HttpError(404, "Contact not found"));
          }

          // Log contact owner and current user's ID for comparison
    console.log('Contact owner:', deletedContact.owner);
    console.log('Current user ID:', ownerId);

      
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
    const ownerId = req.user.userId;
    console.log('Incoming request body:', req.body); // Log the incoming request body
    console.log('Extracted ownerId from token:', ownerId); // Log the extracted ownerId from token

    try {
      const isValid = isValidEmail(email); // Validate email format
      if (!isValid) {
        throw new Error("Invalid email format");
      }
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
        const ownerId = req.user && req.user.userId;

        // Log the received parameters and extracted ownerId
        console.log('Request Params (id):', id);
        console.log('New Data:', newData);
        console.log('Owner ID (from token):', ownerId);

        try {
             // Fetch the contact and perform ownership verification
             const contact = await getContactById(id, ownerId);
             if (!contact) {
                return next(HttpError(404, "Contact not found"));
            }

     // Log the contact owner and current user's ID (ownerId)
    console.log('Contact Owner ID:', contact.owner);
    console.log('Current User ID (ownerId):', ownerId);

     // Check if the newData contains at least one field
            if (Object.keys(newData).length === 0) {
                throw new Error("Body must have at least one field");
            }
             
        const updatedContact = await updateContactById(id, newData, ownerId);

        if (!updatedContact) {
            return next(HttpError(404, "Contact not found"));
          }
      
          res.status(200).json(updatedContact);
        } catch (error) {
            console.error('Error updating contact:', error);
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
  
   