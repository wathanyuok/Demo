import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authClientCheck } from '../middlewares/auth.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  uploadSlip
} from '../controllers/order-controller.js';

const router = express.Router();

// สร้างโฟลเดอร์ถ้ายังไม่มี
const uploadDir = 'public/uploads/slip';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// กำหนด storage สำหรับ multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ใช้เวลาปัจจุบัน + นามสกุลไฟล์เดิม
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // จำกัดขนาดไฟล์ 5MB
  },
  fileFilter: (req, file, cb) => {
    // รับเฉพาะไฟล์รูปภาพ
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('ไฟล์ต้องเป็นรูปภาพเท่านั้น'));
    }
  }
});

// Protect all order routes
router.use(authClientCheck);

// Order routes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/slip/:id', upload.single('slip'), uploadSlip);

export default router;