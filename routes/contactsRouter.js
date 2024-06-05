import express from "express";
import ContactController from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";


const contactsRouter = express.Router();

contactsRouter.get("/",  ContactController.getAllContacts);

contactsRouter.get("/:id", ContactController.getOneContact);

contactsRouter.delete("/:id", ContactController.deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), ContactController.createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), ContactController.updateContact);

contactsRouter.patch("/:id/favorite", validateBody(updateContactSchema), ContactController.updateStatusContact);

export default contactsRouter;