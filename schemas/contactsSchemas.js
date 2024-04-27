// schemas/contactsSchemas.js

import Joi from 'joi';

// Schema for creating a new contact
export const createContactSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  phone: Joi.string().required().trim(),
  
});

// Schema for updating an existing contact
export const updateContactSchema = Joi.object({
  name: Joi.string().allow('').trim(),
  email: Joi.string().email().allow('').trim(),
  phone: Joi.string().allow('').trim(),
 
 
});


