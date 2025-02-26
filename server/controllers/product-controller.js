import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        discounts: {
          where: {
            isActive: true,
            endDate: {
              gte: new Date()
            }
          }
        }
      }
    });
   


    res.json(productsWithDiscount);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Error fetching products',
      error: error.message 
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { categoryId, search } = req.query;
    
    const where = {};
    // Filter by category
    if (categoryId) {
      where.categoryID = categoryId;
    }
    
    // Search by name
    if (search) {
      where.productName = {
        contains: search, 
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        discounts: {
          where: {
            isActive: true,
            endDate: {
              gte: new Date()
            }
          }
        }
      }
    });


    let productsWithDiscount = [];

    for (const product of products) {
      const activeDiscount = product.discounts[0];
      if (activeDiscount) {
        if (activeDiscount.discountType === 'percentage'){       
          product.discountedPrice = product.price * (activeDiscount.discountValue / 100);
        } else { 
          product.discountedPrice = product.price - activeDiscount.discountValue;
        }
      }
      else {
        product.discountedPrice = 0 ;
      }
      productsWithDiscount.push(product);
    }


    res.json(productsWithDiscount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
       productID: id
      },
      include: {
        category: true,
        discounts: {
          where: {
            isActive: true,
            endDate: {
              gte: new Date()
            }
          }
        },
      }
    });

    if (!product) {
      return res.status(404).json({ 
        message: 'Product not found' 
      });
    }

    // คำนวณราคาหลังส่วนลด
    const activeDiscount = product.discounts[0];
    if (activeDiscount) {
      if (activeDiscount.discountType === 'percentage') {
        product.discountedPrice = product.price * (1 - activeDiscount.discountValue / 100);
      } else {
        product.discountedPrice = product.price - activeDiscount.discountValue;
      }
      product.discountType = activeDiscount.discountType;
    }
    else {
      product.discountedPrice = 0;
      product.discountType = null;
    }


    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      message: 'Error fetching product',
      error: error.message 
    });
  }
};