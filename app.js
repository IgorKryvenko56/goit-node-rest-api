import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
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
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/protected', protectedRouter);
app.use("/api/contacts", contactsRouter);


// Handle unknown routes
app.use((req, res) => { 
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





