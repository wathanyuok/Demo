import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const skip = (page - 1) * limit

    const where = search ? {
      categoryName: {
        contains: search.toLowerCase()
      }
    } : {}

    const totalItems = await prisma.category.count({ where })
    const totalPages = Math.ceil(totalItems / limit)

    const categories = await prisma.category.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        categoryName: 'asc'
      }
    })

    const formattedCategories = categories.map(category => ({
      ...category,
      productCount: category._count.products
    }))

    res.json({
      categories: formattedCategories,
      totalPages,
      totalItems,
      currentPage: page,
      itemsPerPage: limit
    })
  } catch (error) {
    console.error('Error getting categories:', error)
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลได้' })
  }
}

export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await prisma.category.findUnique({
      where: { categoryID: id },
      include: {
        products: true
      }
    })

    if (!category) {
      return res.status(404).json({ error: 'ไม่พบหมวดหมู่' })
    }

    res.json(category)
  } catch (error) {
    console.error('Error getting category:', error)
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลได้' })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body

    if (!categoryName || categoryName.trim() === '') {
      return res.status(400).json({ error: 'กรุณากรอกชื่อหมวดหมู่' })
    }

    const normalizedName = categoryName.trim().toLowerCase()

    
    const existingCategory = await prisma.category.findFirst({
      where: { 
        categoryName: {
          equals: normalizedName
        }
      }
    })

    if (existingCategory) {
      return res.status(400).json({ error: 'มีชื่อหมวดหมู่นี้อยู่แล้ว' })
    }

    const category = await prisma.category.create({
      data: { 
        categoryName: normalizedName
      }
    })

    res.status(201).json(category)
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({ error: 'ไม่สามารถสร้างหมวดหมู่ได้' })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { categoryName } = req.body

    if (!categoryName || categoryName.trim() === '') {
      return res.status(400).json({ error: 'กรุณากรอกชื่อหมวดหมู่' })
    }

    const normalizedName = categoryName.trim().toLowerCase()

    
    const existingCategory = await prisma.category.findFirst({
      where: {
        categoryName: {
          equals: normalizedName
        },
        NOT: { categoryID: id }
      }
    })

    if (existingCategory) {
      return res.status(400).json({ error: 'มีชื่อหมวดหมู่นี้อยู่แล้ว' })
    }

    const category = await prisma.category.update({
      where: { categoryID: id },
      data: { 
        categoryName: normalizedName
      }
    })

    res.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'ไม่พบหมวดหมู่ที่ต้องการแก้ไข' })
    }
    res.status(500).json({ error: 'ไม่สามารถอัพเดทหมวดหมู่ได้' })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

   
    const category = await prisma.category.findUnique({
      where: { categoryID: id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return res.status(404).json({ error: 'ไม่พบหมวดหมู่ที่ต้องการลบ' })
    }

    if (category._count.products > 0) {
      return res.status(400).json({ error: 'ไม่สามารถลบหมวดหมู่ที่มีสินค้าอยู่ได้' })
    }

    await prisma.category.delete({
      where: { categoryID: id }
    })
    res.json({ message: 'ลบหมวดหมู่เรียบร้อย' })
  } catch (error) {
    console.error('Error deleting category:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'ไม่พบหมวดหมู่ที่ต้องการลบ' })
    }
    res.status(500).json({ error: 'ไม่สามารถลบหมวดหมู่ได้' })
  }
}