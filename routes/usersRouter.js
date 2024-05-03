// routes/usersRouter.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { registerUser, loginUser } from '../controllers/userController.js';
import { resendVerificationEmail } from '../controllers/emailController.js';        
import { verifyContactOwner }  from '../middleware/verifyOwner.js';
import { uploadAvatar } from "../middleware/multerMiddleware.js";
import { getCurrentUserHandler } from '../controllers/users/currentUser.js';
import { getContactByIdHandler} from '../controllers/users/contactUser.js';
import { logoutUserHandler } from '../controllers/users/logoutUser.js';
import { updateAvatarHandler } from '../controllers/users/avatarUser.js';
import { verifyTokenHandler } from '../controllers/users/tokenUser.js';


const router = express.Router();

// POST api/users/register
router.post('/register', registerUser); 

// POST /api/users/login - User login endpoint
router.post('/login', loginUser);

// GET /api/users/current
router.get('/current', authMiddleware, getCurrentUserHandler); 

//GET /api/users/contacts
router.get('/contacts/:contactId', verifyContactOwner, getContactByIdHandler); 

// POST /api/users/logout
router.post('/logout', authMiddleware, logoutUserHandler); 

// PATCH /api/users/avatars - Update user avatar endpoint
router.patch('/avatars', authMiddleware, uploadAvatar, updateAvatarHandler);  

// GET /api/users/verify/:verificationToken - Verify user's email
router.get('/verify/:verificationToken', verifyTokenHandler); 

// POST /api/users/verify - Resend verification email
router.post('/verify', resendVerificationEmail);

export default router;