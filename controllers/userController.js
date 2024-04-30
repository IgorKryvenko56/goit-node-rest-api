import User from '../models/User.js';
import jimp from 'jimp';
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
//import { uploadAvatar } from '../middleware/multerMiddleware.js';
import HttpError from '../helpers/HttpError.js';


const SALT_ROUNDS = 10;

export const registerUser = async (req, res) => {
    try {
        // Validate request body against registerSchema
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = value;

        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create a new user with hashed password
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Return success response
        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription || 'starter',
            },
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = value;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email or password is wrong' });
        }

         // Extract input password and stored hashed password
        const inputPassword = req.body.password.trim();
        const storedHashedPassword = user.password;

        // Compare passwords
    const isPasswordMatch = await bcrypt.compare(inputPassword, storedHashedPassword);

    if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Email or password is wrong' });
        }

        // Generate JWT token and update user
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );

        user.token = token;
        await user.save();

        // Return success response with token and user details
        res.status(200).json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to get current user's details
export const getCurrentUser = async (userId) => {
    try {
        const user = await User.findById(userId);

        return user; // Return user document
    } catch (error) {
        throw new Error('Error fetching current user'); // Handle error
    }
};

export const postCurrentUserLogout = async (userId) => {
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        throw new Error('User not found');
      }
  
      // Clear the token
      user.token = null;
      await user.save();
    } catch (error) {
      throw new Error('Error logging out user');
    }
  };

  
// Update user avatar
export const updateUserAvatar = async (req, res) => {
  try {
      // Check if req.file is populated by multer
      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded.' });
      }

      const imagePath = req.file.path;

      // Load the uploaded image using jimp
      const image = await jimp.read(imagePath);

      // Resize the image
      await image.resize(250, 250);

      // Define paths for avatar directory
      const avatarDirectory = path.resolve('public', 'avatars');
      const fileExtension = req.file.originalname.split('.').pop();
      const uniqueFilename = `${req.user.userId}.${fileExtension}`;
      const targetFilePath = path.resolve(avatarDirectory, uniqueFilename);

      // Save the resized image to the avatar directory
      await image.writeAsync(targetFilePath);

const serverURL = 'http://localhost:3000'; // Base URL of your server
const avatarPath = '/avatars'; // Path where avatar images are served from
const avatarURL = `${serverURL}${avatarPath}/${uniqueFilename}`;

      // Update user's avatarURL field in the database
      const user = await User.findById(req.user.userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      user.avatarURL = avatarURL;
      await user.save();

      // Return success response with updated avatarURL
      res.status(200).json({ message: 'File uploaded successfully.', avatarURL });
  } catch (error) {
      console.error('Error processing file upload:', error);
      res.status(500).json({ message: 'Server error.' });
  }
};


/*export const updateUserAvatar = async (req, res) => {
  try {
    // Use the uploadAvatar middleware to handle file upload
    uploadAvatar(req, res, async (err) => {
     
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ message: 'Error uploading file.' });
      }

      try {

    // Load the uploaded image using jimp
      const imagePath = req.file.path;
      const image = await jimp.read(imagePath);
      
      // Resize the image to 250x250 pixels
      await image.resize(250, 250);// eslint-disable-next-line no-unused-vars

      // Define paths for temporary and target (public/avatars) directories
      const targetDir = path.resolve('public', 'avatars');
      const userId = req.user.userId;
      const fileExtension = req.file.originalname.split('.').pop();
      const uniqueFilename = `${userId}.${fileExtension}`;
      const targetFilePath = path.resolve(targetDir, uniqueFilename);

      // Save the resized image to the public/avatars directory
      await image.writeAsync(targetFilePath);

       // Update user's avatarURL field in the database
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const avatarURL = `/avatars/${uniqueFilename}`;
      user.avatarURL = avatarURL;
      await user.save();

       // Delete the temporary file after processing
       await fs.unlink(imagePath);

     // Return success response with updated avatarURL
      res.status(200).json({ avatarURL });
    } catch (error) {
      console.error('Error processing avatar:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
*/