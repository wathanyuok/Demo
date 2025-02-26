// server/routes/backoffice/auth-route.js
import express from 'express'
// import { login, getMe } from '../../controllers/backoffice/auth.controller.js'
import { login } from '../../controllers/backoffice/auth.controller.js'
// import { authCheck } from '../../middlewares/auth.js'

const router = express.Router()

// router.post('/register', register)
router.post('/login', login)
// router.get('/me', authCheck, getMe)

export default router