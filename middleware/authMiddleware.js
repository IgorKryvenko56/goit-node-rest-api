// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
//import HttpError from '../helpers/HttpError.js';


const authMiddleware = async (req, res, next) => {
  try {
     const authHeader = req.headers.authorization;

     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ message: 'Authorization header missing or malformed' });
     }
     const token = authHeader.split(' ')[1];
     console.log('Received token:', token); // Log the received token

    // Verify token
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     console.log('Decoded token:', decoded); // Log the decoded token
    
     // Check if decoded token contains userId

    if (!decoded || !decoded.userId) {
      console.log('Decoded token is invalid or missing userId'); // Log if userId is missing
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Find user in database using userId from token
    const user = await User.findById(decoded.userId);
    console.log('User found by userId:', user); // Log the user found by userId
    
    // Check if user does not match
    if (!user) {
      console.log('User not found in the database'); // Log if user is not found
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Attach user data to the request object for further use in protected routes
    req.user =  {
      userId: user._id,
      email: user.email, // Include any other relevant user data
    };
 
    next();
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

export default authMiddleware;


  // Get token from Authorization header
    //const token = req.headers.authorization?.replace('Bearer ', '');
    //if (!token) {
     // return res.status(401).json({ message: 'Not authorized' });}