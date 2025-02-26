const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.productDiscount.deleteMany()
  await prisma.product.deleteMany()
  await prisma.discount.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const hashedPassword = await bcrypt.hash('12345678', 10)
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    }
  })

  console.log('Created admin user:', admin)

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        categoryName: 'Manga'
      }
    }),
    prisma.category.create({
      data: {
        categoryName: 'Light Novel'
      }
    }),
    prisma.category.create({
      data: {
        categoryName: 'Anime Merchandise'
      }
    })
  ])

  console.log('Created categories:', categories)

  // Create discounts
  const discounts = await Promise.all([
    prisma.discount.create({
      data: {
        discountType: 'percentage',
        discountValue: 20,
        description: 'ส่วนลดสำหรับ Manga 20%'
      }
    }),
    prisma.discount.create({
      data: {
        discountType: 'fixed',
        discountValue: 50,
        description: 'ส่วนลด 50 บาท'
      }
    }),
    prisma.discount.create({
      data: {
        discountType: 'percentage',
        discountValue: 15,
        description: 'ส่วนลด 15% สำหรับสินค้าใหม่'
      }
    })
  ])

  console.log('Created discounts:', discounts)

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        productName: 'One Piece Vol. 1',
        description: 'The beginning of the great pirate era',
        price: 250,
        stockQuantity: 50,
        categoryID: categories[0].categoryID,
        productImage: 'https://example.com/one-piece-1.jpg'
      }
    }),
    prisma.product.create({
      data: {
        productName: 'Sword Art Online Vol. 1',
        description: 'The virtual reality MMORPG light novel',
        price: 320,
        stockQuantity: 30,
        categoryID: categories[1].categoryID,
        productImage: 'https://example.com/sao-1.jpg'
      }
    }),
    prisma.product.create({
      data: {
        productName: 'Naruto Action Figure',
        description: 'High-quality Naruto Uzumaki action figure',
        price: 1500,
        stockQuantity: 20,
        categoryID: categories[2].categoryID,
        productImage: 'https://example.com/naruto-figure.jpg'
      }
    }),
    prisma.product.create({
      data: {
        productName: 'Attack on Titan Vol. 1',
        description: 'The story of humanity\'s fight for survival',
        price: 250,
        stockQuantity: 40,
        categoryID: categories[0].categoryID,
        productImage: 'https://example.com/aot-1.jpg'
      }
    }),
    prisma.product.create({
      data: {
        productName: 'Re:Zero Vol. 1',
        description: 'The story of starting life in another world',
        price: 320,
        stockQuantity: 25,
        categoryID: categories[1].categoryID,
        productImage: 'https://example.com/rezero-1.jpg'
      }
    })
  ])

  console.log('Created products:', products)

  // Create product discounts
  const productDiscounts = await Promise.all([
    // One Piece มีส่วนลด 20%
    prisma.productDiscount.create({
      data: {
        productID: products[0].productID,
        discountID: discounts[0].discountID,
        discountType: 'percentage',
        discountValue: 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 วัน
        isActive: true
      }
    }),
    // SAO มีส่วนลด 50 บาท
    prisma.productDiscount.create({
      data: {
        productID: products[1].productID,
        discountID: discounts[1].discountID,
        discountType: 'fixed',
        discountValue: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 วัน
        isActive: true
      }
    }),
    // Naruto Figure มีส่วนลด 15%
    prisma.productDiscount.create({
      data: {
        productID: products[2].productID,
        discountID: discounts[2].discountID,
        discountType: 'percentage',
        discountValue: 15,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 วัน
        isActive: true
      }
    })
  ])

  console.log('Created product discounts:', productDiscounts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })