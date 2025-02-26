import express from 'express';
import { authClientCheck } from '../middlewares/auth.js';
import {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem
} from '../controllers/cart-controller.js';

const router = express.Router();

// Protect all cart routes
router.use(authClientCheck);

// Cart routes
router.post('/', addToCart);
router.get('/', getCartItems);
router.put('/:id', updateCartItem);
router.delete('/:id', removeCartItem);

export default router;