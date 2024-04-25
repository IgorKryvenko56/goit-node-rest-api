import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.DB_HOST;
    await mongoose.connect(uri);
    console.log('Database connection successful');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit with error
  }
};

export default connectDB;