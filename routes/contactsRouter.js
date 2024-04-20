import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import { verifyContactOwner } from "../middleware/verifyOwner.js";
import authMiddleware from '../middleware/authMiddleware.js';
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";


const contactsRouter = express.Router();

// Apply authentication middleware to all contacts routes
contactsRouter.use(authMiddleware);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", verifyContactOwner, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", verifyContactOwner, validateBody(updateContactSchema), updateContact);

export default contactsRouter;