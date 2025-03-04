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
    // ดึงข้อมูลสินค้าจาก request body
    const { productName, description, price, stockQuantity, categoryID} = req.body;
    let productImage = null;
    let localImagePath = null;

    // ตรวจสอบว่ามีการอัปโหลดไฟล์รูปภาพหรือไม่
    if (req.file) {
      try {
        // กำหนด path ของโฟลเดอร์ 'uploads'
        const uploadDir = path.join(process.cwd(), 'uploads');

        // ตรวจสอบและสร้างโฟลเดอร์ 'uploads' ถ้ายังไม่มี
        try {
          await fs.access(uploadDir);
        } catch {
          await fs.mkdir(uploadDir, { recursive: true });
        }

        // สร้างชื่อไฟล์ใหม่โดยใช้เวลาปัจจุบัน
        const timestamp = Date.now();
        const ext = path.extname(req.file.originalname);
        const newFilename = `product-${timestamp}${ext}`;
        const targetPath = path.join(uploadDir, newFilename);

        // ย้ายไฟล์จาก temp ไปยังโฟลเดอร์ uploads
        await fs.copyFile(req.file.path, targetPath);
        await fs.unlink(req.file.path); // ลบไฟล์ temp
        localImagePath = `/uploads/${newFilename}`;

        try {
          // อัปโหลดไฟล์ไปยัง Cloudinary
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

        // ลบไฟล์ temp หากมีข้อผิดพลาด
        if (req.file?.path) {
          try {
            await fs.unlink(req.file.path);
          } catch (unlinkError) {
            console.error('Error deleting temp file:', unlinkError);
          }
        }

        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' });
      }
    }


    // สร้างข้อมูลสินค้าใหม่ในฐานข้อมูลโดยใช้ Prisma
    const product = await prisma.product.create({
      data: {
        productName,
        description,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
        productImage,
        categoryID,
      },
      include: { category: true },
    });
    

    // ส่งข้อมูลสินค้าที่สร้างกลับไปพร้อมกับ status code 201
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);

    // ลบไฟล์รูปภาพที่อัปโหลดแล้วในกรณีที่เกิดข้อผิดพลาด
    if (localImagePath) {
      try {
        const fullPath = path.join(process.cwd(), localImagePath);
        
        // ตรวจสอบว่าไฟล์มีอยู่ก่อนลบ
        try {
          await fs.access(fullPath);
          await fs.unlink(fullPath);
        } catch (accessError) {
          console.error('File does not exist or already deleted:', accessError);
        }
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    // ส่งข้อความแจ้งเตือนข้อผิดพลาดกลับไป
    res.status(500).json({ error: 'ไม่สามารถสร้างสินค้าได้' });
  }
};



export const updateProduct = async (req, res) => {
  try {
    // ดึง ID ของสินค้าที่ต้องการอัปเดตจาก URL parameters
    const { id } = req.params;

    // ค้นหาสินค้าที่มีอยู่ในฐานข้อมูลด้วย ID ที่ได้รับมา
    const existingProduct = await prisma.product.findUnique({
      where: { productID: id },
    });

    // ถ้าไม่พบสินค้า ส่งข้อความแจ้งเตือนกลับพร้อม status code 404
    if (!existingProduct) {
      return res.status(404).json({ error: 'ไม่พบสินค้า' });
    }

    // ประกาศตัวแปรสำหรับเก็บ URL ของรูปภาพสินค้าและ path ของไฟล์ภาพในเครื่อง
    let productImage = null;
    let localImagePath = null;

    // ตรวจสอบว่ามีไฟล์รูปภาพใหม่ถูกอัปโหลดมาหรือไม่
    if (req.file) {
      try {
        // กำหนด path ของโฟลเดอร์ 'uploads' และสร้างชื่อไฟล์ใหม่
        const uploadDir = path.join(process.cwd(), 'uploads');
        const timestamp = Date.now();
        const ext = path.extname(req.file.originalname);
        const newFilename = `product-${timestamp}${ext}`;
        const targetPath = path.join(uploadDir, newFilename);

        // คัดลอกไฟล์จาก path ชั่วคราวไปยัง path เป้าหมาย
        await fs.copyFile(req.file.path, targetPath);
        // ลบไฟล์ชั่วคราว
        await fs.unlink(req.file.path);
        // เก็บ path ของไฟล์ในเครื่อง
        localImagePath = `/uploads/${newFilename}`;

        try {
          // พยายามอัปโหลดไฟล์ไปยัง Cloudinary
          const result = await cloudinary.uploader.upload(targetPath, {
            folder: 'products',
          });
          // เก็บ URL จาก Cloudinary
          productImage = result.secure_url;
          // ลบไฟล์ในเครื่องหลังจากอัปโหลดสำเร็จ
          await fs.unlink(targetPath);
        } catch (cloudinaryError) {
          // ถ้าอัปโหลด Cloudinary ไม่สำเร็จ ใช้ path ของไฟล์ในเครื่องแทน
          console.error('Cloudinary upload error:', cloudinaryError);
          productImage = localImagePath;
        }

        // ลบรูปภาพเก่าออกถ้ามีและเป็นไฟล์ในเครื่อง
        if (existingProduct.productImage && existingProduct.productImage.startsWith('/uploads/')) {
          const oldFilePath = path.join(process.cwd(), existingProduct.productImage);
          await fs.unlink(oldFilePath).catch((err) => console.error('Error deleting old file:', err));
        }
      } catch (error) {
        // จัดการข้อผิดพลาดที่อาจเกิดขึ้นระหว่างการอัปโหลดไฟล์
        console.error('File upload error:', error);
        if (req.file.path) {
          await fs.unlink(req.file.path); // ลบไฟล์ชั่วคราวถ้ามีข้อผิดพลาด
        }
      }
    }

    // สร้าง object ที่เก็บข้อมูลที่จะอัปเดต
    const updateData = {
      productName: req.body.productName,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stockQuantity: parseInt(req.body.stockQuantity),
      categoryID: req.body.categoryID,
      ...(productImage && { productImage }), // รวมรูปภาพใหม่เข้าไปด้วยถ้ามี
    };

    // ใช้ Prisma เพื่ออัปเดตข้อมูลสินค้าในฐานข้อมูล
    const updatedProduct = await prisma.product.update({
      where: { productID: id },
      data: updateData,
    });

    // ส่งข้อมูลสินค้าที่อัปเดตแล้วกลับไป
    res.json(updatedProduct);
  } catch (error) {
    // จัดการข้อผิดพลาดที่อาจเกิดขึ้นในกระบวนการอัปเดตสินค้า
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'ไม่สามารถอัพเดทสินค้าได้' });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    // Delete the product
    await prisma.product.delete({
      where: { productID: id }
    })

    res.json({ message: 'ลบสินค้าสำเร็จ' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'ไม่สามารถลบสินค้าได้' })
  }
}
