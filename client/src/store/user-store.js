// นำเข้า create จากไลบรารี Zustand เพื่อสร้าง global store
import { create } from 'zustand';

// สร้าง Zustand store ชื่อ useUserStore สำหรับจัดการสถานะ (state) ของผู้ใช้
const useUserStore = create((set) => ({
  // สถานะเริ่มต้นของผู้ใช้ (user) เป็น null หมายความว่ายังไม่มีผู้ใช้ล็อกอิน
  user: null,

  // สถานะสำหรับตรวจสอบว่ากำลังโหลดข้อมูลอยู่หรือไม่ เช่น ระหว่างเรียก API
  isLoading: false,

  // สถานะสำหรับเก็บข้อความข้อผิดพลาด เช่น "รหัสผ่านไม่ถูกต้อง"
  error: null,

  // ฟังก์ชันสำหรับตั้งค่าผู้ใช้ (user) ใน store
  setUser: (user) => set({ user }),

  // ฟังก์ชันสำหรับล้างข้อมูลผู้ใช้ โดยตั้งค่า user เป็น null
  clearUser: () => set({ user: null }),

  // ฟังก์ชันสำหรับตั้งค่าสถานะการโหลด (isLoading)
  setLoading: (isLoading) => set({ isLoading }),

  // ฟังก์ชันสำหรับตั้งค่าข้อความข้อผิดพลาด (error)
  setError: (error) => set({ error }),

  // ฟังก์ชันสำหรับออกจากระบบ (logout)
  logout: () => {
    // ลบ token ออกจาก localStorage เพื่อยกเลิกการยืนยันตัวตน
    localStorage.removeItem('token');

    // ตั้งค่า user เป็น null เพื่อแสดงว่าผู้ใช้ไม่ได้ล็อกอินอีกต่อไป
    set({ user: null });
  },

  // ฟังก์ชันสำหรับรีเซ็ตสถานะทั้งหมดใน store กลับไปเป็นค่าเริ่มต้น
  reset: () => {
    set({
      user: null,       // ล้างข้อมูลผู้ใช้
      isLoading: false, // ตั้งค่าสถานะการโหลดเป็น false
      error: null       // ล้างข้อความข้อผิดพลาด
    });
  }
}));

// ส่งออก useUserStore เพื่อให้สามารถใช้งานในไฟล์อื่นได้
export { useUserStore };
