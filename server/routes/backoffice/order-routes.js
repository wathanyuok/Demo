import express from 'express'
import { getOrders, updateOrderStatus } from '../../controllers/backoffice/order.controller.js'

const router = express.Router()

router.get('/', getOrders)
router.put('/:id', updateOrderStatus)

export default router
