import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';

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