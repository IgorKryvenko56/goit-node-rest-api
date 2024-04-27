// routes/protectedRouter.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const protectedRouter = express.Router();

// Example protected route
protectedRouter.get('/profile', authMiddleware, (req, res) => {
  // Access authenticated user via req.user
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
});


export default protectedRouter;

