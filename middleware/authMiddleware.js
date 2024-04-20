// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';


const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    //const token = req.headers.authorization?.replace('Bearer ', '');
    //if (!token) {
     // return res.status(401).json({ message: 'Not authorized' });}
     const authHeader = req.headers.authorization;
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ message: 'Authorization header missing or malformed' });
     }
 
     const token = authHeader.split(' ')[1];
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if decoded token contains userId
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Find user in database using userId from token
    const user = await User.findById(decoded.userId);

    // Check if user or token does not match
    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Attach user data to the request object for further use in protected routes
    req.user = user;
    next();
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

export default authMiddleware;
