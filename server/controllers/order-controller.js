import { PrismaClient } from '@prisma/client';
import cloudinary from 'cloudinary';
import fs from 'fs';
const prisma = new PrismaClient();

// สร้างคำสั่งซื้อใหม่
export const createOrder = async (req, res) => {
  try {
    const { items, total, address } = req.body;
    const customerID = req.user.id;

    // ตรวจสอบสินค้าในสต็อก
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { productID: item.productID }
      });

      if (!product) {
        return res.status(404).json({ message: `ไม่พบสินค้ารหัส ${item.productID}` });
      }

      if (product.stockQuantity < item.qty) {
        return res.status(400).json({ 
          message: `สินค้า ${product.productName} มีไม่เพียงพอ (เหลือ ${product.stockQuantity} ชิ้น)` 
        });
      }
    }

    // สร้างคำสั่งซื้อและอัปเดตสต็อกสินค้า
    const order = await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          customerID,
          totalAmount: total,
          address,
          status: 'pending',
          orderdate: new Date(),
          orderDetails: {
            create: items.map(item => ({
              productID: item.productID,
              quantity: item.qty,
              price: item.product.price
            }))
          }
        },
        include: {
          orderDetails: {
            include: {
              product: true
            }
          }
        }
      });

      // อัปเดตสต็อกสินค้า
      for (const item of items) {
        await prisma.product.update({
          where: { productID: item.productID },
          data: {
            stockQuantity: {
              decrement: item.qty 
            }
          }
        });
      }

      // ลบสินค้าในตะกร้า
      await prisma.cart.deleteMany({
        where: { customerID }
      });

      return newOrder;
    });

    res.json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ' });
  }
};


// อัพโหลดสลิปการโอนเงิน
export const uploadSlip = async (req, res) => {
  try {
    const { id } = req.params;
    const customerID = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: 'กรุณาอัพโหลดสลิปการโอนเงิน' });
    }

    const order = await prisma.order.findFirst({
      where: {
        orderID: id,
        customerID
      },
      include: {
        payment: true
      }
    });

    if (!order) {
      // ลบไฟล์ชั่วคราวถ้าไม่พบคำสั่งซื้อ
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อ' });
    }

    if (order.status !== 'pending') {
      // ลบไฟล์ชั่วคราวถ้าสถานะไม่ถูกต้อง
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'ไม่สามารถอัพโหลดสลิปได้ เนื่องจากสถานะคำสั่งซื้อไม่ถูกต้อง' });
    }

    // อัพโหลดไปยัง Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'slips',
      resource_type: 'image',
      format: 'webp'
    });

    // ลบไฟล์ชั่วคราวหลังจากอัพโหลดสำเร็จ
    fs.unlinkSync(req.file.path);

    const payment = await prisma.payment.upsert({
      where: {
        orderID: id
      },
      create: {
        orderID: id,
        paymentDate: new Date(),
        slip: result.secure_url,
        amount: order.totalAmount,
        paymentMethod: 'bank_transfer'
      },
      update: {
        slip: result.secure_url,
        paymentDate: new Date()
      }
    });

    const updatedOrder = await prisma.order.update({
      where: { orderID: id },
      data: {
        status: 'paid'
      },
      include: {
        payment: true
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    // ลบไฟล์ในกรณีที่เกิด error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload slip error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัพโหลดสลิป' });
  }
};


// ดึงรายการคำสั่งซื้อทั้งหมดของลูกค้า
export const getOrders = async (req, res) => {
  try {
    const customerID = req.user.id;

    const orders = await prisma.order.findMany({
      where: {
        customerID
      },
      include: {
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
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ' });
  }
};

// ดึงรายละเอียดคำสั่งซื้อ
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const customerID = req.user.id;

    const order = await prisma.order.findFirst({
      where: {
        orderID: id,
        customerID
      },
      include: {
        orderDetails: {
          include: {
            product: true
          }
        },
        payment: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อ' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ' });
  }
};
