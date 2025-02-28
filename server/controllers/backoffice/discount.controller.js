import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getDiscounts = async (req, res) => {
  try {
   

    const totalItems = await prisma.discount.count({ where })
    const totalPages = Math.ceil(totalItems / limit)

    const discounts = await prisma.discount.findMany({
      where,
      skip,
      take: limit,
      select: {
        discountID: true,
        description: true,
        discountType: true,
        discountValue: true
      },
      orderBy: {
        description: 'asc'
      }
    })

    res.json({
      discounts,
      totalPages,
      totalItems,
      currentPage: page,
      itemsPerPage: limit
    })
  } catch (error) {
    console.error('Error getting discounts:', error)
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลส่วนลดได้' })
  }
}

export const createDiscount = async (req, res) => {
  try {
    const { description, discountType, discountValue } = req.body

    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'กรุณากรอกคำอธิบายส่วนลด' })
    }

    if (!discountType || !['percentage', 'fixed'].includes(discountType.toLowerCase())) {
      return res.status(400).json({ error: 'ประเภทส่วนลดไม่ถูกต้อง' })
    }

    const value = parseFloat(discountValue)
    if (isNaN(value) || value <= 0) {
      return res.status(400).json({ error: 'มูลค่าส่วนลดต้องเป็นตัวเลขที่มากกว่า 0' })
    }

    if (discountType.toLowerCase() === 'percentage' && value > 100) {
      return res.status(400).json({ error: 'เปอร์เซ็นต์ส่วนลดต้องไม่เกิน 100%' })
    }

    const normalizedDesc = description.trim().toLowerCase()

    // ตรวจสอบว่ามีชื่อส่วนลดนี้อยู่แล้วหรือไม่
    const existingDiscount = await prisma.discount.findFirst({
      where: { 
        description: {
          equals: normalizedDesc
        }
      }
    })

    if (existingDiscount) {
      return res.status(400).json({ error: 'มีคำอธิบายส่วนลดนี้อยู่แล้ว' })
    }
    
    const discount = await prisma.discount.create({
      data: {
        description: normalizedDesc,
        discountType: discountType.toLowerCase(),
        discountValue: value
      }
    })
    
    res.status(201).json(discount)
  } catch (error) {
    console.error('Error creating discount:', error)
    res.status(500).json({ error: 'ไม่สามารถสร้างส่วนลดได้' })
  }
}

export const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params
    const { description, discountType, discountValue } = req.body

    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'กรุณากรอกคำอธิบายส่วนลด' })
    }

    if (!discountType || !['percentage', 'fixed'].includes(discountType.toLowerCase())) {
      return res.status(400).json({ error: 'ประเภทส่วนลดไม่ถูกต้อง' })
    }

    const value = parseFloat(discountValue)
    if (isNaN(value) || value <= 0) {
      return res.status(400).json({ error: 'มูลค่าส่วนลดต้องเป็นตัวเลขที่มากกว่า 0' })
    }

    if (discountType.toLowerCase() === 'percentage' && value > 100) {
      return res.status(400).json({ error: 'เปอร์เซ็นต์ส่วนลดต้องไม่เกิน 100%' })
    }

    const normalizedDesc = description.trim().toLowerCase()

    // ตรวจสอบว่ามีชื่อส่วนลดนี้อยู่แล้วหรือไม่ (ยกเว้นตัวเอง)
    const existingDiscount = await prisma.discount.findFirst({
      where: {
        description: {
          equals: normalizedDesc
        },
        NOT: { discountID: id }
      }
    })

    if (existingDiscount) {
      return res.status(400).json({ error: 'มีคำอธิบายส่วนลดนี้อยู่แล้ว' })
    }
    
    const discount = await prisma.discount.update({
      where: { discountID: id },
      data: {
        description: normalizedDesc,
        discountType: discountType.toLowerCase(),
        discountValue: value
      }
    })
    
    res.json(discount)
  } catch (error) {
    console.error('Error updating discount:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'ไม่พบส่วนลดที่ต้องการแก้ไข' })
    }
    res.status(500).json({ error: 'ไม่สามารถอัพเดทส่วนลดได้' })
  }
}

export const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params

    // ตรวจสอบว่ามีส่วนลดนี้อยู่หรือไม่ และมีการใช้งานในสินค้าหรือไม่
    const discount = await prisma.discount.findUnique({
      where: { discountID: id },
    })

    if (!discount) {
      return res.status(404).json({ error: 'ไม่พบส่วนลดที่ต้องการลบ' })
    }

    await prisma.discount.delete({
      where: { discountID: id }
    })

    await prisma.productDiscount.deleteMany({
      where: { discountID: id }
    })
    res.json({ message: 'ลบส่วนลดเรียบร้อย' })
  } catch (error) {
    console.error('Error deleting discount:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'ไม่พบส่วนลดที่ต้องการลบ' })
    }
    res.status(500).json({ error: 'ไม่สามารถลบส่วนลดได้' })
  }
}