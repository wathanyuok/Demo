import express from 'express'
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount } from '../../controllers/backoffice/discount.controller.js'
import { authCheck } from '../../middlewares/auth.js'

const router = express.Router()

router.use(authCheck)

router.get('/', getDiscounts)
router.post('/', createDiscount)
router.put('/:id', updateDiscount)
router.delete('/:id', deleteDiscount)

export default router