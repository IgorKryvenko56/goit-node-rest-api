import { updateUserAvatar } from '../userController.js';

export const updateAvatarHandler = async (req, res) => {
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
};