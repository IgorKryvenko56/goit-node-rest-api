// models/Contact.js
import { Schema } from 'mongoose';
import Joi from "joi";
import HttpError from "../HttpError.js";


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
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
});

contactSchema.post("save", HttpError);

const Contact = model('Contact', contactSchema);

export default Contact;
