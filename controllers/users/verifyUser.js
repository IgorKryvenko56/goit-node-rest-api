import { sendVerificationEmail } from '../controllers/userController.js';


export const resendVerificationEmail = async (req, res) => {
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
};