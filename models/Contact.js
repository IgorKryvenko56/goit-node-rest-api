// models/Contact.js
import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  } 
}, {
  versionKey: false // Exclude the __v field from the document
});


const Contact = model('Contact', contactSchema);

export default Contact;