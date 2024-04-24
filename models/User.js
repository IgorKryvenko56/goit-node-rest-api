// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    subscription: {
        type: String,
        enum: ['starter', 'pro', 'business'],
        default: 'starter',
    },
    token: {
      type: String,
      default: null,
  },
},
{ versionKey: false, timestamps: true });
  

const User = model('User', userSchema);

export default User;



