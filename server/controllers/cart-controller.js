import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const addToCart = async (req, res) => {
  try {
    const { productID, quantity, price } = req.body;
    const customerID = req.user.id;


    if (!productID || !quantity) {
      return res.status(400).json({ message: 'กรุณาระบุข้อมูลให้ครบถ้วน' });
    }

 
    const product = await prisma.product.findUnique({
      where: { productID: productID }
    });

    if (!product) {
      return res.status(404).json({ message: 'ไม่พบสินค้า' });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'สินค้าคงเหลือไม่เพียงพอ' });
    }

    const existingCartItem = await prisma.cart.findFirst({
      where: {
        customerID,
        productID: productID
      }
    });

    let cartItem;

    if (existingCartItem) {
      
      cartItem = await prisma.cart.update({
        where: { cartID: existingCartItem.cartID },
        data: {
          qty: existingCartItem.qty + quantity,
          total: (existingCartItem.qty + quantity) * price // ใช้ราคาที่ส่งมาจากหน้าสินค้า
        }
      });
    } else {
      cartItem = await prisma.cart.create({
        data: {
          customerID,
          productID: productID,
          qty: quantity,
          total: quantity * price // ใช้ราคาที่ส่งมาจากหน้าสินค้า
        }
      });
    }

    res.json(cartItem);

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า' });
  }
};



export const getCartItems = async (req, res) => {
  try {
    const customerID = req.user.id;

    const cart = await prisma.cart.findMany({
      where: { customerID },
      include: {
        product: {
          select: {
            productName: true,
            price: true,
            productImage: true,
            stockQuantity: true,
            discounts: {
              where: {
                startDate: {
                  lte: new Date()
                },
                endDate: {
                  gte: new Date()
                }
              },
              orderBy: {
                discountValue: 'desc'
              },
              take: 1
            }
          }
        }
      }
    });

    // คำนวณราคาที่รวมส่วนลดแล้ว
    const cartWithDiscounts = cart.map(item => {
      const activeDiscount = item.product.discounts[0];
      let discountedPrice = item.product.price;
      
      if (activeDiscount) {
        if (activeDiscount.discountType === 'percentage') {
          discountedPrice = item.product.price * (1 - activeDiscount.discountValue / 100);
        } else {
          discountedPrice = item.product.price - activeDiscount.discountValue;
        }
      }

      return {
        ...item,
        product: {
          ...item.product,
          discountedPrice,
          activeDiscount: activeDiscount || null
        }
      };
    });

    res.json(cartWithDiscounts);

  } catch (error) {
    console.error('Get cart items error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า' });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const {  quantity } = req.body;
    const { id } = req.params;
    const customerID = req.user.id;


    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'จำนวนสินค้าไม่ถูกต้อง' });
    }

    const cartItem = await prisma.cart.findFirst({
      where: {
        cartID: id,
        customerID
      },
      include: {
        product: true
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'ไม่พบสินค้าในตะกร้า' });
    }

  
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ message: 'สินค้าคงเหลือไม่เพียงพอ' });
    }

    const updatedCartItem = await prisma.cart.update({
      where: { cartID: id},
      data: { 
        qty: quantity
       },
    });

    res.json({
      message: 'อัพเดทจำนวนสินค้าสำเร็จ',
      cartItem: updatedCartItem
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const customerID = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: {
        cartID: id,
        customerID
      }
    });

    if (!cart) {
      return res.status(404).json({ message: 'ไม่พบสินค้าในตะกร้า' });
    }

    await prisma.cart.delete({
      where: { cartID: id }
    });

    res.json({ message: 'ลบสินค้าออกจากตะกร้าสำเร็จ' });

  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' });
  }
};