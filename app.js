import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import usersRouter from './routes/usersRouter.js';
import protectedRouter from './routes/protectedRouter.js';
import contactsRouter from  "./routes/contactsRouter.js";


dotenv.config();
const app = express();
// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// Middleware to log request details
app.use((req, res, next) => {
  console.log('Incoming Request:', req.method, req.url);
  console.log('Request Headers:', req.headers);
  next();
});

// Serve static files (avatars)
app.use(express.static("public"));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/protected', protectedRouter);


// Handle unknown routes
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});
// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});