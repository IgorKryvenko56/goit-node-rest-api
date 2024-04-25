// models/User.js
import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import gravatar from 'gravatar';

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
  avatarURL: {
    type: String,
    default: function() {
        // Generate avatar URL based on user's email using Gravatar
        const hash = crypto.createHash('md5').update(this.email).digest('hex');
        return `https://gravatar.com/avatar/${hash}?d=robohash`;
  },
 },
},
{ versionKey: false, timestamps: true });

//Pre-save hook to generate Gravatar URL if avatarURL is not provided
userSchema.pre('save', async function(next) {
   if (this.isNew && !this.avatarURL ) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');
    console.log({ emailHash });

    this.avatarURL = `https://gravatar.com/avatar/${hash}?d=robohash`;
   }
   next();
});
  

const User = mongoose.model('User', userSchema);

export default User;