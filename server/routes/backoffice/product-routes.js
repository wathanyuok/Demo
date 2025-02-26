// server/routes/backoffice/product-routes.js
import express from 'express'
import multer from 'multer'
import { authCheck } from '../../middlewares/auth.js'
import * as productController from '../../controllers/backoffice/product.controller.js'

const router = express.Router()

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads') // เก็บไฟล์ชั่วคราวใน uploads directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

// Protect all routes with authentication
router.use(authCheck)

// Product routes
router.get('/', productController.getProducts)
router.get('/:id', productController.getProduct)
router.post('/', upload.single('file'), productController.createProduct)
router.put('/:id', upload.single('file'), productController.updateProduct)
router.delete('/:id', productController.deleteProduct)

export default router