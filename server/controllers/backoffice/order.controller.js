import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1  
    //รับค่า 'page' จาก query string ของ request
    //แปลงเป็นตัวเลขด้วย parseInt()
    // ถ้าไม่มีค่าหรือแปลงไม่ได้ จะใช้ค่าเริ่มต้นเป็น 1

    const limit = parseInt(req.query.limit) || 10

    const search = req.query.search || ''
    // รับค่า 'search' (คำค้นหา) จาก query string
    // ถ้าไม่มีค่า จะใช้เป็นสตริงว่าง

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
    // prisma.order: เป็นการอ้างอิงถึงโมเดล 'order' ใน Prisma schema
    // .count(): เป็นเมธอดของ Prisma ที่ใช้นับจำนวนรายการในฐานข้อมูล
    // { where }: เป็นการส่งเงื่อนไขการค้นหาที่กำหนดไว้ก่อนหน้านี้ ซึ่งอาจรวมถึงการค้นหาตาม orderID หรือชื่อลูกค้า
    // await: ใช้เพื่อรอผลลัพธ์จากการนับ เนื่องจากเป็นการทำงานแบบ asynchronous


    const totalPages = Math.ceil(totalItems / limit)
    // totalItems: จำนวนรายการทั้งหมดที่ตรงกับเงื่อนไขการค้นหา (ได้มาจากการนับก่อนหน้านี้)
    // limit: จำนวนรายการที่แสดงต่อหนึ่งหน้า (กำหนดไว้ก่อนหน้านี้)    
    // totalItems / limit: หารจำนวนรายการทั้งหมดด้วยจำนวนรายการต่อหน้า    
    // Math.ceil(): ปัดเศษขึ้นให้เป็นจำนวนเต็ม เพื่อให้แน่ใจว่าจะมีหน้าสำหรับรายการที่เหลือ    
    // const totalPages: เก็บผลลัพธ์จำนวนหน้าทั้งหมด    
    // ประโยชน์ของการคำนวณจำนวนหน้าทั้งหมด:    
    // ใช้ในการสร้างตัวควบคุมการนำทางหน้า (pagination controls)    
    // แสดงให้ผู้ใช้ทราบว่ามีกี่หน้าทั้งหมด    
    // ใช้ในการตรวจสอบว่าหน้าที่ร้องขอมาอยู่ในช่วงที่ถูกต้องหรือไม่





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
