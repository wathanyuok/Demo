// server/controllers/backoffice/product.controller.js
import { PrismaClient } from '@prisma/client'
import cloudinary from '../../configs/cloudinary.js'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = (req.query.search || '').toLowerCase()
    const skip = (page - 1) * limit

    const where = search ? {
      OR: [
        { productName: { contains: search } },
        { description: { contains: search } }
      ]
    } : {}


    const totalItems = await prisma.product.count({ where })
    const totalPages = Math.ceil(totalItems / limit)

    const currentDate = new Date()

    

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
        discounts: {
          where: {
            startDate: {
              lte: currentDate
            },
            endDate: {
              gte: currentDate
            },
            isActive: true
          },
        }
      },
    })

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      }
    })
  } catch (error) {
    console.error('Error getting products:', error)
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลสินค้าได้' })
  }
}

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { productID: id },
      include: {
        category: true,
        discounts: true,
      }
    })

    if (!product) {
      return res.status(404).json({ error: 'ไม่พบสินค้า' })
    }

    res.json(product)
  } catch (error) {
    console.error('Error getting product:', error)
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลสินค้าได้' })
  }
}

export const createProduct = async (req, res) => {
  try {
    const { productName, description, price, stockQuantity, categoryID, discounts } = req.body;
    let productImage = null;
    let localImagePath = null;

    if (req.file) {
      try {
        const uploadDir = path.join(process.cwd(), 'uploads');

        // ตรวจสอบและสร้างโฟลเดอร์ถ้ายังไม่มี
        try {
          await fs.access(uploadDir);
        } catch {
          await fs.mkdir(uploadDir, { recursive: true });
        }

        const timestamp = Date.now();
        const ext = path.extname(req.file.originalname);
        const newFilename = `product-${timestamp}${ext}`;
        const targetPath = path.join(uploadDir, newFilename);

        // ย้ายไฟล์ไปยังโฟลเดอร์ uploads
        await fs.copyFile(req.file.path, targetPath);
        await fs.unlink(req.file.path); // ลบไฟล์ temp
        localImagePath = `/uploads/${newFilename}`;

        try {
          const result = await cloudinary.uploader.upload(targetPath, {
            folder: 'products',
          });
          productImage = result.secure_url;

          // ลบไฟล์ local หลังอัปโหลดสำเร็จ
          await fs.unlink(targetPath);
        } catch (cloudinaryError) {
          console.error('Cloudinary upload error:', cloudinaryError);
          productImage = localImagePath; // ใช้ path local แทน หาก Cloudinary ล้มเหลว
        }
      } catch (error) {
        console.error('File upload error:', error);

        if (req.file?.path) {
          try {
            await fs.unlink(req.file.path); // ลบไฟล์ temp หากมี
          } catch (unlinkError) {
            console.error('Error deleting temp file:', unlinkError);
          }
        }

        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' });
      }
    }

    const discountData = JSON.parse(discounts || '[]');

    const product = await prisma.product.create({
      data: {
        productName,
        description,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
        productImage,
        categoryID,
        discounts: {
          create: discountData.map((discount) => ({
            discountID: discount.discountID,
            discountType: discount.discountType,
            discountValue: discount.discountValue,
            startDate: new Date(discount.startDate),
            endDate: new Date(discount.endDate),
            isActive: true,
          })),
        },
      },
      include: { category: true, discounts: true },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);

    if (localImagePath) {
      try {
        const fullPath = path.join(process.cwd(), localImagePath);
        
        // ตรวจสอบว่าไฟล์มีอยู่ก่อนลบ
        try {
          await fs.access(fullPath);
          await fs.unlink(fullPath); // ลบไฟล์ที่อัปโหลดแล้ว
        } catch (accessError) {
          console.error('File does not exist or already deleted:', accessError);
        }
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({ error: 'ไม่สามารถสร้างสินค้าได้' });
  }
};



export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ดึงข้อมูลสินค้าปัจจุบันเพื่อตรวจสอบรูปภาพเก่า
    const existingProduct = await prisma.product.findUnique({
      where: { productID: id },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'ไม่พบสินค้า' });
    }

    let productImage = undefined;
    let localImagePath = null;

    if (req.file) {
      try {
        const uploadDir = path.join(process.cwd(), 'uploads');
        const timestamp = Date.now();
        const ext = path.extname(req.file.originalname);
        const newFilename = `product-${timestamp}${ext}`;
        const targetPath = path.join(uploadDir, newFilename);

        // ย้ายไฟล์ไปยังโฟลเดอร์ uploads
        await fs.copyFile(req.file.path, targetPath);
        await fs.unlink(req.file.path);
        localImagePath = `/uploads/${newFilename}`;

        try {
          const result = await cloudinary.uploader.upload(targetPath, {
            folder: 'products',
          });
          productImage = result.secure_url;
          // ลบไฟล์ใน local หลังอัปโหลดสำเร็จ
          await fs.unlink(targetPath);
        } catch (cloudinaryError) {
          console.error('Cloudinary upload error:', cloudinaryError);
          productImage = localImagePath;
        }

        // ลบรูปภาพเก่า ถ้ามีการอัปโหลดใหม่สำเร็จ
        if (existingProduct.productImage && existingProduct.productImage.startsWith('/uploads/')) {
          const oldFilePath = path.join(process.cwd(), existingProduct.productImage);
          await fs.unlink(oldFilePath).catch((err) => console.error('Error deleting old file:', err));
        }
      } catch (error) {
        console.error('File upload error:', error);
        if (req.file.path) {
          await fs.unlink(req.file.path); // ลบไฟล์ temp
        }
      }
    }

    // เตรียมข้อมูลสำหรับการอัปเดต
    const updateData = {
      productName: req.body.productName,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stockQuantity: parseInt(req.body.stockQuantity),
      categoryID: req.body.categoryID,
      ...(productImage && { productImage }), // อัปเดตรูปภาพใหม่ถ้ามี
    };

    // อัปเดตสินค้าในฐานข้อมูล
    const updatedProduct = await prisma.product.update({
      where: { productID: id },
      data: updateData,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'ไม่สามารถอัพเดทสินค้าได้' });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    // Delete associated discounts first
    await prisma.productDiscount.deleteMany({
      where: { productID: id }
    })

    // Then delete the product
    await prisma.product.delete({
      where: { productID: id }
    })

    res.json({ message: 'ลบสินค้าสำเร็จ' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'ไม่สามารถลบสินค้าได้' })
  }
}