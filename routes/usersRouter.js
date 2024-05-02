// routes/usersRouter.js
import express from 'express';
import User from '../models/User.js';
import Contact from '../models/Contact.js'; 
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getCurrentUser,
         postCurrentUserLogout, updateUserAvatar, verifyUserEmail } 
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
router.patch('/avatars', authMiddleware, uploadAvatar, async (req, res) => {
    try {
        // Check if req.file is populated by multer
        if (!req.file) {
            console.log('No file attached to request.');
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Handle file upload logic
        const file = req.file;
        console.log('Uploaded File:', file);

        const avatarURL = `http://localhost:3000/api/users/avatars${file.filename}`;
        await updateUserAvatar(req.user.userId, avatarURL);

        res.status(200).json({ message: 'Avatar uploaded successfully.', avatarURL });
    } catch (error) {
        console.error('Error processing file upload:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /auth/verify/:verificationToken - Verify user's email
router.get('/auth/verify/:verificationToken', async (req, res) => {
    try {
        const { verificationToken } = req.params;

        // Call the verifyUserEmail function to handle email verification
        const result = await verifyUserEmail(verificationToken);

        // Respond with success message if verification was successful
        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        // Respond with error message if user not found
        res.status(404).json({ message: 'User not found' });
    }
});

// POST /api/users/verify - Resend verification email
router.post('/verify', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the required email field is missing in the request body
        if (!email) {
            return res.status(400).json({ message: 'Missing required field: email' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is already verified
        if (user.verify) {
            return res.status(400).json({ message: 'Verification has already been passed' });
        }

        // Resend the verification email with the existing verification token
        await sendVerificationEmail(email, user.verificationToken);

        // Return success response
        res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
        console.error('Error resending verification email:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
export default router;