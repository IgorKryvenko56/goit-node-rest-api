// routes/usersRouter.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import User from '../models/User.js';
import Contact from '../models/Contact.js'; 
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getCurrentUser, postCurrentUserLogout } from '../controllers/userController.js';
import { verifyContactOwner }  from '../middleware/verifyOwner.js';

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

export default router;






