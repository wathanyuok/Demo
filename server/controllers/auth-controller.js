import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, phonenumber, address } = req.body;

  
    const existingUser = await prisma.customer.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

 
    const newCustomer = await prisma.customer.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        phonenumber,
        address
      }
    });

    // Remove password from response
    const { password: _, ...customerData } = newCustomer;

    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ',
      customer: customerData
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;


    console.log("email",email);
    console.log("Password",password);
    
    const customer = await prisma.customer.findUnique({
      where: { email }
    });

    if (!customer) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, customer.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }


    const token = jwt.sign(
      { id: customer.customerID, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
  }
};

export const currentUser = async (req, res) => {
  try {



    const customer = await prisma.customer.findUnique({
      where: { customerID: req.user.id },
      select: {
        customerID: true,
        firstname: true,
        lastname: true,
        email: true,
        phonenumber: true,
        address: true
      }
    });

    if (!customer) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้' });
    }

    res.json(customer);

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
};
