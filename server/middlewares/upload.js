import multer from 'multer';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100);
    cb(null, uniqueSuffix + '-' + file.originalname); 
  }
});

// Create and export the multer instance
const upload = multer({ storage: storage });

export default upload; 
