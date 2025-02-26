import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const skip = (page - 1) * limit

    const where = search ? {
      OR: [
        { orderID: { contains: search } },
        { customer: {
          OR: [
            { firstname: { contains: search } },
            { lastname: { contains: search } }
          ]
        }}
      ]
    } : {}

    const totalItems = await prisma.order.count({ where })
    const totalPages = Math.ceil(totalItems / limit)

    const orders = await prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        customer: {
          select: {
            firstname: true,
            lastname: true
          }
        },
        orderDetails: {
          include: {
            product: true
          }
        },
        payment: true
      },
      orderBy: {
        orderdate: 'desc'
      }
    })

    res.json({
      orders,
      totalPages,
      totalItems,
      currentPage: page,
      itemsPerPage: limit
    })
  } catch (error) {
    console.error('Error getting orders:', error)
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลออเดอร์ได้' })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'สถานะไม่ถูกต้อง' })
    }

    const order = await prisma.order.update({
      where: { orderID: id },
      data: { status }
    })

    res.json(order)
  } catch (error) {
    console.error('Error updating order status:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'ไม่พบออเดอร์ที่ต้องการอัพเดท' })
    }
    res.status(500).json({ error: 'ไม่สามารถอัพเดทสถานะได้' })
  }
}
