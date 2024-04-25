import express from "express";
import morgan from "morgan";
import cors from "cors";
import multer from "multer";
import path from "path"; 
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import usersRouter from './routes/usersRouter.js';
import protectedRouter from './routes/protectedRouter.js';
import contactsRouter from  "./routes/contactsRouter.js";

dotenv.config();
const app = express();
// Connect to MongoDB
connectDB();

//app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file

// Middleware
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// Configure static file serving
const publicPath = path.resolve('./public');
app.use(express.static(publicPath));
// Routes
app.use('/api/users', usersRouter);
app.use('/api/protected', protectedRouter);
app.use("/api/contacts", contactsRouter);

// Handle unknown routes
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});
// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


