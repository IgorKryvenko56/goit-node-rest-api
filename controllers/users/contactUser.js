// controllers/users/contactUser.js
import Contact from '../../models/Contact.js'

export const getContactByIdHandler = async (req, res) => {
    const contactId = req.params.contactId;
    try {
        const contact = await Contact.getContactById(contactId);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(contact || []);
    } catch (error) {
        console.error('Error getting contact by id:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
