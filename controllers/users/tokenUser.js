import { verifyUserEmail } from '../userController.js';

export const verifyTokenHandler = async (req, res) => {
    const { verificationToken } = req.params;
    try {
        // Call the verifyUserEmail function to handle email verification
        const result = await verifyUserEmail(verificationToken);

        // Respond with success message if verification was successful
        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        // Respond with error message if user not found
        res.status(404).json({ message: 'User not found' });
    }
};