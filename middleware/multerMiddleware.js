import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import HttpError from '../helpers/HttpError.js';

// Multer storage configuration
const multerStorage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, path.join(process.cwd(),'public', 'avatars')); // Specify the directory for storing uploaded files
  },

  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${extension}`;// Generate a unique filename 
    cb(null, fileName);
   },
});

//config filter
const multerFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
  cb(null, true);
  } else {
    cb(new HttpError(400, 'Please upload images only'), false);
  }
};

// Create the Multer middleware
 export const uploadAvatar = multer({
   storage: multerStorage,
   fileFilter: multerFileFilter,
   limits: {
    fileSize: 2 * 1024 * 1024, //1048576,
   },
}).single("avatar");

   