import User from '../models/User.js';
import jimp from 'jimp';
import path from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../services/emailService.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import { uploadAvatar } from '../middleware/multerMiddleware.js';
import HttpError from '../helpers/HttpError.js';
import { triggerAsyncId } from 'async_hooks';



const SALT_ROUNDS = 10;


export const registerUser = async (req, res) => {
    try {
        // Validate request body against registerSchema
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = req.body;

        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Generate verification token
    const verificationToken = uuidv4();
        
    // Create a new user with hashed password and verification token
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create a new user with hashed password
        const newUser = new User({ email, password: hashedPassword, verificationToken });
        await newUser.save();

        // Send verification email
    await sendVerificationEmail(email, verificationToken);

         // Return success response
        res.status(201).json({
          message: 'User registered successfully. Verification email sent.',
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

// Function to handle email verification (route handler)
export const verifyUserEmail = async (verificationToken) => {
  try {
    // Find user by verification token
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw new Error('User not found');
    }
    // Update user's verification status
    user.verify = true;
    user.verificationToken = null;
    await user.save();
    // Return true if verification is successful
    return true; 
  } catch (error) {
    throw error; // Throw error if user not found
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
