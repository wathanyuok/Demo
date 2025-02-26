// นำเข้า jsonwebtoken เพื่อใช้ในการสร้างและตรวจสอบ JWT (JSON Web Token)
import jwt from 'jsonwebtoken'

// นำเข้า PrismaClient เพื่อเชื่อมต่อกับฐานข้อมูล
import { PrismaClient } from '@prisma/client'

// สร้างอินสแตนซ์ของ PrismaClient เพื่อใช้สำหรับการทำงานกับฐานข้อมูล
const prisma = new PrismaClient()



// ฟังก์ชัน middleware อีกตัวสำหรับตรวจสอบ JWT แต่ไม่ได้เชื่อมต่อกับฐานข้อมูล
export const authClientCheck = async (req, res, next) => {
  try {
    // ดึงค่า Authorization header จาก request
    const authHeader = req.headers.authorization;

    // ตรวจสอบว่า Authorization header มีค่าและขึ้นต้นด้วย "Bearer " หรือไม่
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // หากไม่มีหรือไม่ถูกต้อง ให้ส่งสถานะ 401 (Unauthorized) กลับไปพร้อมข้อความแจ้งเตือน
      return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบ' });
    }

    // แยกเอาโทเค็นออกจาก Authorization header (หลังคำว่า "Bearer ")
    const token = authHeader.split(' ')[1];

    // ตรวจสอบและถอดรหัสโทเค็นด้วย secret key ที่กำหนดใน environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // เพิ่มข้อมูลที่ถอดรหัสได้จากโทเค็นลงใน request object เพื่อให้ใช้งานในฟังก์ชันถัดไป
    req.user = decoded;
    
    // เรียก next() เพื่อส่งต่อไปยัง middleware หรือ route handler ถัดไป
    next();
  } catch (error) {
    // หากเกิดข้อผิดพลาด เช่น โทเค็นไม่ถูกต้องหรือหมดอายุ ให้แสดงข้อผิดพลาดใน console และส่งสถานะ 401 กลับไป
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'โทเค็นไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่' });
  }
}

// ฟังก์ชัน middleware สำหรับตรวจสอบ JWT และยืนยันตัวตนผู้ใช้ (คล้ายกับ authenticateToken)
export const authCheck = async (req, res, next) => {
  try {
    // ดึงค่า Authorization header จาก request
    const authHeader = req.headers.authorization

    // ตรวจสอบว่า Authorization header มีค่าและขึ้นต้นด้วย "Bearer " หรือไม่
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // หากไม่มีหรือไม่ถูกต้อง ให้ส่งสถานะ 401 (Unauthorized) กลับไปพร้อมข้อความแจ้งเตือน
      return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' })
    }

    // แยกเอาโทเค็นออกจาก Authorization header (หลังคำว่า "Bearer ")
    const token = authHeader.split(' ')[1]

    // ตรวจสอบและถอดรหัสโทเค็นด้วย secret key ที่กำหนดใน environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // แสดงผลข้อมูลที่ถอดรหัสได้ใน console (สำหรับ debugging)
    console.log("decoded", decoded)

    // ค้นหาผู้ใช้ในฐานข้อมูลโดยใช้ userID ที่ได้จากโทเค็น
    const user = await prisma.user.findFirst({
      where: { userID: decoded.id } // ใช้ userID ที่อยู่ในโทเค็นเพื่อตรวจสอบว่ามีผู้ใช้อยู่จริงหรือไม่
    })

    // หากไม่พบผู้ใช้ในฐานข้อมูล ให้ส่งสถานะ 401 (Unauthorized) กลับไปพร้อมข้อความแจ้งเตือน
    if (!user) {
      return res.status(401).json({ error: 'ไม่พบผู้ใช้งาน' })
    }

    // หากพบผู้ใช้ ให้เพิ่มข้อมูลผู้ใช้ลงใน request object เพื่อให้ใช้งานในฟังก์ชันถัดไป
    req.user = user

    // เรียก next() เพื่อส่งต่อไปยัง middleware หรือ route handler ถัดไป
    next()
  } catch (error) {
    // หากเกิดข้อผิดพลาด เช่น โทเค็นไม่ถูกต้องหรือหมดอายุ ให้แสดงข้อผิดพลาดใน console และส่งสถานะ 401 กลับไป
    console.error('Auth error:', error)
    res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' })
  }
}
