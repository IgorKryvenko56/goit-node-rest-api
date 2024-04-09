import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactFavoriteStatus,
  validateCreateContact,
  validateUpdateContact,
} from "../controllers/contactsControllers.js";


const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateCreateContact, createContact);

contactsRouter.put("/:id", validateUpdateContact, updateContact);

// PATCH to update favorite status of a contact by ID
contactsRouter.patch("/:contactId/favorite", updateContactFavoriteStatus);

export default contactsRouter;