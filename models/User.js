// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import gravatar from 'gravatar';

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
    verify: {
        type: Boolean,
        default: false,
        },
    verificationToken: {
        type: String,
        required: function() {
            return !this.verify;
          },
        //required: [true, 'Verify token is required'],
        },
    
  avatarURL: {
    type: String,
    default: function() {
        if (this.email) {
        const emailHash = crypto.createHash('md5').update(this.email).digest('hex');
        return `https://gravatar.com/avatar/${emailHash}?d=robohash`;
    }
    return null;
  },
 },
}, { versionKey: false, timestamps: true });

//Pre-save hook to generate Gravatar URL if avatarURL is not provided
userSchema.pre('save', async function(next) {
   if (this.isNew && !this.avatarURL ) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');
    console.log({ emailHash });

    this.avatarURL = `https://gravatar.com/avatar/${emailHash}?d=robohash`;
   }
   next();
});
  

const User = model('User', userSchema);

export default User;