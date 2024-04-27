import Contact from '../models/Contact.js';

export const verifyContactOwner = async (req, res, next) => {
  console.log('req.user:', req.user);

  const userId  = req.user?.userId;
  console.log('Extracted userId:', userId);

  if (!userId) {
    console.log('Unauthorized - User ID not found');
    return res.status(403).json({ message: 'Unauthorized - User ID not found' });
  }
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);
    console.log('Contact found:', contact); // Log the retrieved contact

    if (!contact) {
      console.log('Contact not found')
      return res.status(404).json({ message: 'Contact not found' });
    }

    console.log('Contact owner:', contact.owner);
    console.log('Authenticated userId:', userId);

//contact.owner and userId are both instances of ObjectId, 
//but the comparison might not be working as expected 
//due to the way ObjectId instances are compared in JavaScript.

// Convert contact.owner to string before comparison 
    if (!contact.owner || contact.owner.toString() !== userId.toString()) {
      console.log('Ownership verification failed.');
      return res.status(403).json({ message: 'Unauthorized to modify this contact' });
    }

    next(); // Proceed to the next middleware/controller if ownership is verified
  } catch (error) {
    console.error('Error verifying contact ownership:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export default verifyContactOwner;