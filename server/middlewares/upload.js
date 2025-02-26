// server/middlewares/upload.js
import multer from 'multer'

// ใช้ memory storage แทน disk storage เพื่อให้สามารถอัพโหลดไป cloudinary ได้
const storage = multer.memoryStorage()

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limit 5MB
  },
  fileFilter: (req, file, cb) => {
    // เช็คประเภทไฟล์
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('ไฟล์ต้องเป็นรูปภาพเท่านั้น'))
    }
  }
})