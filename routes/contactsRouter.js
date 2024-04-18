import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import { verifyContactOwner } from "../middleware/verifyOwner.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", verifyContactOwner, deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", verifyContactOwner, updateContact);

export default contactsRouter;