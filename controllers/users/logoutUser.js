import { postCurrentUserLogout } from '../userController.js';

export const logoutUserHandler = async (req, res) => {
    try {
        await postCurrentUserLogout(req.user.userId);
        res.status(204).end(); // 204 No Content
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};