import { isValidObjectId } from "mongoose";
import Contact from "../models/contact.js";

async function getAllContacts (req, res, next) {
    try {
        const contacts = await Contact.find({owner: req.user.userId});
         res.status(200).send(contacts)
        }
    catch (error) {
        next(error) }; 
};

async function getOneContact (req, res, next) {
    const contactId = req.params.id;
   try {
    if (!isValidObjectId(contactId)) {
       return res.status(400).send({ message: "Invalid contact ID" });        ;
    }
    
    const contact = await Contact.findById({owner: req.user.userId, _id: contactId});
    if (!contact) {
        return res.status(404).send({ message: "Not found" });            
        }
    res.status(200).send(contact);    
   }
   catch (error) {
       next(error) }
};

async function deleteContact (req, res, next) {
    const contactId = req.params.id;
    try {
        if (!isValidObjectId(contactId)) {
           return res.status(400).send({ message: "Invalid contact ID" });            ;
        }
        
        const contact = await Contact.findByIdAndDelete({_id: contactId, owner: req.user.userId});
    if (!contact) {
       return res.status(404).send({ message: "Not found" });        ;
    } 
        res.status(204).end();
    }  catch (error) {
        next(error) }
}

async function createContact (req, res, next) {
    const { name, email, phone } = req.body;
    try {
        const contact = await Contact.create({ name, email, phone, owner: req.user.userId });
        res.status(201).send(contact);
    } catch (error) {
        next(error) }
    }
 

   async function updateContact (req, res, next) {    
    const data  = req.body;
    const id = req.params.id;
    if (!isValidObjectId(id)) {
        res.status(400).send({ message: "Invalid contact ID" });
        return;
    }    
    if (!data.name && !data.email && !data.phone) {
        return res.status(400).send({ message: "Body must have at least one field" });
        } 
    
        try {
    const contact = await Contact.findByIdAndUpdate(id, data, { new: true });
    
    
    if (!contact) {
        res.status(404).send({ message: "user Not found" });
        return;
    }
    res.status(200).send(contact);
    }
    catch (error) {
        next(error) }
    }

    async function updateStatusContact (req, res, next) {
        const id = req.params.id;
        const data  = req.body;
        if (!data.favorite) {
            return res.status(400).send({ message: "Body must have favorite field" });
            }
        if (!isValidObjectId(id)) {
            res.status(400).send({ message: "Invalid contact ID" });
            return;
        }
        
        try {
        const contact = await Contact.findByIdAndUpdate(id, data, { new: true });
        if (!contact) {
            res.status(404).send({ message: "Not found" });
    }
    res.status(200).send(contact);
} 
catch (error) {
    next(error) }
    }

export default {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
    updateStatusContact
};