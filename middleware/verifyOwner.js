import Contact from '../models/Contact.js';

export const verifyContactOwner = async (req, res, next) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (!contact.owner || contact.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to modify this contact' });
    }

    next(); // Proceed to the next middleware/controller if ownership is verified
  } catch (error) {
    console.error('Error verifying contact ownership:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
