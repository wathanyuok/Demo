import express from 'express';
const router = express.Router();
import { register, login, currentUser } from '../controllers/auth-controller.js';
import { authClientCheck } from '../middlewares/auth.js';


router.post('/register', register);


router.post('/login', login);

router.get('/me', authClientCheck, currentUser);

export default router;