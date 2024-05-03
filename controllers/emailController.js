// controllers/emailController.js
import { sendVerificationEmail } from '../services/emailService.js';
import User from '../models/User.js';

export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Missing required field: email' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.verify) {
            return res.status(400).json({ message: 'Verification has already been passed' });
        }
        await sendVerificationEmail(email, user.verificationToken);
        res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
        console.error('Error resending verification email:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

