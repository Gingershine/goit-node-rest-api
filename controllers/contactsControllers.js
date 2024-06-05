import Contact from "../models/contact.js";

async function getAllContacts (req, res, next) {
    try {
        const contacts = await Contact.find({});
         res.status(200).send(contacts)
        }
    catch (error) {
        next(error) }; 
};

async function getOneContact (req, res, next) {
    const contactId = req.params.id;
   try { const contact = await Contact.findById(contactId);
    if (!contact) {
            res.status(404).send({ message: "Not found" });
            return;
        }
        res.status(200).send(contact);    
   }
   catch (error) {
       next(error) }
};

async function deleteContact (req, res) {
    const contactId = req.params.id;
    try {
        const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
        res.status(404).send({ message: "Not found" });
        return;
    } else {
        res.status(204).send(contact).end();
    } }  catch (error) {
        next(error) }
}

async function createContact (req, res) {
    const { name, email, phone } = req.body;
    try {
        const contact = await Contact.create({ name, email, phone });
        res.status(201).send(contact);
    } catch (error) {
        next(error) }
    }
 

   async function updateContact (req, res) {
    const id = req.params.id;
    const data  = req.body;
    if (!data.name && !data.email && !data.phone) {
        return res.status(400).send({ message: "Body must have at least one field" });
        } 
    try {
    const contact = await Contact.findByIdAndUpdate(id, data, { new: true });
    if (!contact) {
        res.status(404).send({ message: "Not found" });
        return;
    }
    res.status(200).send(contact);
    }
    catch (error) {
        next(error) }
    }

    async function updateStatusContact (req, res) {
        const id = req.params.id;
        const data  = req.body;
        if (!data.favorite) {
            return res.status(400).send({ message: "Body must have favorite field" });
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