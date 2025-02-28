import express from 'express'
import { createDiscount, updateDiscount, deleteDiscount } from '../../controllers/backoffice/discount.controller.js'
import { authCheck } from '../../middlewares/auth.js'

const router = express.Router()

router.use(authCheck)


router.put('/:id', updateDiscount)
router.delete('/:id', deleteDiscount)

export default router