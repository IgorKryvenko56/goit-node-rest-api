import multer from 'multer';

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for the stored file
  }
});

// Create the Multer instance
const upload = multer({ storage: storage });

// Multer middleware function for handling file uploads
const uploadSingle = upload.single('avatar'); // 'avatar' should match the name attribute in the form field

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
