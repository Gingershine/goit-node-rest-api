import contactsService from "../services/contactsServices.js";

export const getAllContacts = (req, res) => {
    contactsService
    .listContacts()
    .then((contacts) => res.status(200).json(contacts))
    .catch((err) => res.status(500).json({ message: err.message })); 
};

export const getOneContact = (req, res) => {
    const contactId = req.params.id;
   contactsService.getContactById(contactId) 
   .then((contact) => {
    if (!contact) {
            res.status(404).json({ message: "Not found" });
            return;
        }
        res.status(200).json(contact);    
   })
   .catch(()=>res.status(404).json({ message: "Not found" }));       
};

export const deleteContact = (req, res) => {
    const contactId = req.params.id;
    contactsService.removeContact(contactId)
    .then((contact) => {
    if (!contact) {
        res.status(404).json({ message: "Not found" });
        return;
    } else {
        res.status(200).json(contact);
    }   
})
    .catch(()=>res.status(404).json({ message: "Not found" }));
};

export const createContact = (req, res) => {
    const { name, email, phone } = req.body;
    
contactsService.addContact(name, email, phone)
.then((contact) => res.status(201).json(contact))
.catch((err) => res.status(500).json({ message: err.message }));
   };

export const updateContact = (req, res) => {
    const id = req.params.id;
    const data  = req.body;
    if (!data.name && !data.email && !data.phone) {
        return res.status(400).json({ message: "Body must have at least one field" });
    } 
    contactsService.updateContact(
        id,
      data
    ).then((updatedContact) => {
        if (!updatedContact) {
            res.status(404).json({ message: "Not found" });
            return;
        }
        res.status(200).json(updatedContact);
    })
    .catch(() => res.status(404).json({message: "Not found"}));    
};