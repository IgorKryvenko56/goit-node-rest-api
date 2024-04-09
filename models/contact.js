import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: String,
  phone: String,
  favorite: {
    type: Boolean,
    default: false,
  },
}, 
{ versionKey: false});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;



