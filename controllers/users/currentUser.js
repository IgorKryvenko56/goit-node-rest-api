// controllers/users/currentUser.js
import { getCurrentUser } from '../userController.js';

export const getCurrentUserHandler = async (req, res) => {
    try {
        const user = await getCurrentUser(req.user.userId);
        res.status(200).json({
            email: user.email,
            subscription: user.subscription || 'starter',
        });
    } catch (error) {
        console.error('Current user error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
