import mongoose from 'mongoose';
import express from 'express';
import connectDB from './db/db.js';
import contactsRouter from './routes/contactsRouter.js';
import morgan from "morgan";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.DB_HOST); // Log the DB_HOST to verify it's loaded

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan("tiny")); // Logging
app.use(cors()); // Cross-Origin Resource Sharing
app.use(express.json());

// Routes
app.use('/api/contacts', contactsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status ||500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
  
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running. Use our API on port: ${PORT}`);
});





