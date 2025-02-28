import express from 'express';
import { authCheck } from '../../middlewares/auth.js';
import * as productController from '../../controllers/backoffice/product.controller.js';
import upload from '../../middlewares/upload.js'; // Import upload middleware

const router = express.Router();

// Protect all routes with authentication
router.use(authCheck);

// Product routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', upload.single('file'), productController.createProduct);
router.put('/:id', upload.single('file'), productController.updateProduct); 
router.delete('/:id', productController.deleteProduct);

export default router;
