import multer from 'multer';
import HttpError from '../helpers/HttpError';

// Multer storage configuration
const multerStorage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, path.join('public', 'avatars')); // Use the original file name for the stored file
  },
   filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    cb(null, `${req.user.id}-${v4()}.${extension}`);
   },
});

//config filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('avatars/')) {
  cb(null, true);
  } else {
    cb(new HttpError(400, 'Please upload images only'), false);
  }
}

// Create the Multer middleware
export const uploadAvatar = multer({
   storage: multerStorage,
   fileFilter: multerFilter,
   limits: {
    fieldSize: 2 * 1024 * 1024,
   },
   }).single('avatar');

// Multer middleware function for handling file uploads
/*const uploadSingle = upload.single('avatar'); // 'avatar' should match the name attribute in the form field

// Middleware function to handle file upload
function handleAvatarUpload(req, res, next) {
  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error occurred
      return res.status(500).json({ error: 'Error uploading file.' });
    } else if (err) {
      // Other error occurred
      return res.status(500).json({ error: 'Unexpected error.' });
    }
    next(); // Move to the next middleware
  });
}
*/