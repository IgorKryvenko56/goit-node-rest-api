// routes/usersRouter.js
import express from 'express';
//import jwt from 'jsonwebtoken';
//import bcrypt from 'bcryptjs';
//import Joi from 'joi';
import User from '../models/User.js';
import Contact from '../models/Contact.js'; 
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getCurrentUser,
         postCurrentUserLogout, updateUserAvatar } 
         from '../controllers/userController.js';
import { verifyContactOwner }  from '../middleware/verifyOwner.js';
import { uploadAvatar } from "../middleware/multerMiddleware.js";

const router = express.Router();

// POST api/users/register
router.post('/register', registerUser); 

// POST /api/users/login - User login endpoint
router.post('/login', loginUser);

// GET /users/current
router.get('/current', authMiddleware, async (req, res) => {
    try {
        // Access authenticated user's data from req.user
        const user = await getCurrentUser(req.user.userId);

        // Return success response with user data
        res.status(200).json({ 
            email:user.email,
            subscription: user.subscription || 'starter',
        });
    } catch (error) {
        console.error('Current user error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/contacts/:contactId', verifyContactOwner , async (req, res) => {
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
  });

// POST /users/logout
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        await postCurrentUserLogout(req.user.userId);
        res.status(204).end(); // 204 No Content
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// PATCH /api/users/avatars - Update user avatar endpoint
router.patch('/avatars', authMiddleware, uploadAvatar, updateUserAvatar,  (req, res) => {
    // Log the entire req object
    console.log('Request Object:', req);
    console.log('Request Body:', req.body); // Log form fields
console.log('Uploaded File:', req.file); // Log uploaded file

    // Further processing...
    try {
        // Check if req.file is populated by multer
        if (!req.file) {
            console.log('No file attached to request.');
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Handle file upload logic
        const file = req.file;
        console.log('Uploaded File:', file);

        // Add your file processing logic here
        // Example: save the file, update database, etc.

        res.status(200).json({ message: 'File uploaded successfully.' });
    } catch (error) {
        console.error('Error processing file upload:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});


export default router;