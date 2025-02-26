// นำเข้า useState จาก React เพื่อจัดการ state ภายในคอมโพเนนต์
import { useState } from 'react';

// นำเข้า Link และ useNavigate จาก react-router-dom สำหรับการนำทางระหว่างหน้า
import { Link, useNavigate } from 'react-router-dom';

// นำเข้า axios สำหรับการเรียกใช้งาน API
import axios from 'axios';

// นำเข้า useUserStore ซึ่งเป็น custom hook สำหรับจัดการสถานะผู้ใช้ (user)
import { useUserStore } from '../../store/user-store';

// นำเข้าไอคอนจากไลบรารี lucide-react เพื่อใช้ใน UI
import { LogIn, Mail, Lock } from 'lucide-react';

// นำเข้า Swal (SweetAlert2) สำหรับแสดงข้อความแจ้งเตือนแบบ Popup
import Swal from 'sweetalert2';

// สร้างคอมโพเนนต์ Login สำหรับหน้าล็อกอิน
const Login = () => {
  // สร้าง state email และ password เพื่อเก็บค่าที่ผู้ใช้กรอกในฟอร์ม
  const [email, setEmail] = useState(""); // ค่าเริ่มต้นเป็นค่าว่าง
  const [password, setPassword] = useState(""); // ค่าเริ่มต้นเป็นค่าว่าง

  // สร้าง state error เพื่อเก็บข้อความแสดงข้อผิดพลาด
  const [error, setError] = useState("");

  // ใช้ useNavigate เพื่อสร้างฟังก์ชันสำหรับนำทางไปยังหน้าอื่น
  const navigate = useNavigate();

  // ดึงฟังก์ชัน setUser จาก global store (useUserStore) เพื่ออัปเดตข้อมูลผู้ใช้หลังจากเข้าสู่ระบบสำเร็จ
  const setUser = useUserStore((state) => state.setUser);

  // ฟังก์ชัน handleSubmit สำหรับจัดการเมื่อผู้ใช้กดปุ่ม "เข้าสู่ระบบ"
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการ reload หน้าเมื่อส่งฟอร์ม
    setError("");       // รีเซ็ตข้อความแสดงข้อผิดพลาดก่อนเริ่มกระบวนการใหม่

    try {
      // ส่งคำขอ POST ไปยัง API เพื่อตรวจสอบข้อมูลเข้าสู่ระบบ
      const response = await axios.post(
        `${import.meta.env.VITE_URL_SERVER_API}/api/auth/login`, // URL ของ API (ดึงมาจาก environment variable)
        {
          email,    // ส่งค่า email ที่ผู้ใช้กรอก
          password, // ส่งค่ารหัสผ่านที่ผู้ใช้กรอก
        }
      );

      // ดึง token จาก response หลังจากเข้าสู่ระบบสำเร็จ
      const token = response.data.token;

      // บันทึก token ลงใน localStorage เพื่อใช้งานในครั้งถัดไป
      localStorage.setItem("token", token);

      // เรียก API `/api/auth/me` เพื่อนำข้อมูลผู้ใช้มาเก็บใน state หลังจากเข้าสู่ระบบสำเร็จ
      const userResponse = await axios.get(
        `${import.meta.env.VITE_URL_SERVER_API}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน header เพื่อยืนยันตัวตน
          },
        }
      );

      // อัปเดตข้อมูลผู้ใช้ใน global store ด้วยข้อมูลที่ได้จาก API
      setUser(userResponse.data);

      // แสดงข้อความแจ้งเตือนสำเร็จด้วย SweetAlert2
      await Swal.fire({
        icon: 'success',           // ไอคอนแจ้งเตือนแบบสำเร็จ
        title: 'เข้าสู่ระบบสำเร็จ',   // หัวข้อของข้อความแจ้งเตือน
        text: 'ยินดีต้อนรับกลับ!',   // ข้อความเพิ่มเติมใน popup
        timer: 1500,               // ตั้งเวลาให้ popup ปิดอัตโนมัติใน 1.5 วินาที
        showConfirmButton: false,  // ไม่แสดงปุ่มยืนยันใน popup
        position: 'top',           // ตำแหน่งของ popup อยู่ด้านบนของหน้าจอ
        backdrop: false            // ไม่แสดงพื้นหลังมืดด้านหลัง popup
      });

      // เปลี่ยนเส้นทางไปยังหน้าแรกของเว็บไซต์ (/)
      navigate("/");
    } catch (err) {
      // หากเกิดข้อผิดพลาด ให้ตั้งค่าข้อความข้อผิดพลาดจาก API หรือข้อความเริ่มต้น
      setError(
        err.response?.data?.message || "มีข้อผิดพลาดในการเข้าสู่ระบบ"
      );
    }
  };

  return (
    <>
      {/* ส่วนหลักของหน้า */}
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-base-100 flex items-center justify-center px-4 py-20">
        {/* กล่องฟอร์มล็อกอิน */}
        <div className="max-w-md w-full bg-base-100 rounded-2xl shadow-2xl p-8 border border-base-200">
          {/* ส่วนหัวของฟอร์ม */}
          <div className="text-center mb-8">
            {/* ไอคอนล็อกอิน */}
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-base-content">เข้าสู่ระบบ</h1>
            <p className="text-base-content/60 mt-2">
              ยินดีต้อนรับกลับ! กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ
            </p>
          </div>

          {/* แสดงข้อความข้อผิดพลาดหากมี */}
          {error && (
            <div className="alert alert-error mb-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* ฟอร์มสำหรับกรอกข้อมูลล็อกอิน */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ช่องกรอกอีเมล */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" /> อีเมล
                </span>
              </label>
              <input 
                type="email" 
                name="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="your@email.com" 
                className="input input-bordered w-full bg-base-100" 
                required 
              />
            </div>

            {/* ช่องกรอกรหัสผ่าน */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" /> รหัสผ่าน
                </span>
              </label>
              <input 
                type="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="input input-bordered w-full bg-base-100" 
                required 
              />
            </div>

            {/* ปุ่มสำหรับส่งฟอร์ม */}
            <button type="submit" className="btn btn-primary w-full">เข้าสู่ระบบ</button>
          </form>

          {/* ลิงก์ไปยังหน้าสมัครสมาชิก */}
          <p className="text-center text-base-content/70 mt-8">
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" className="link link-primary font-medium hover:link-primary-focus">สมัครสมาชิก</Link>
          </p>
        </div>
      </main>
    </>
  );
};

// ส่งออกคอมโพเนนต์ Login เพื่อให้สามารถใช้งานในไฟล์อื่นได้
export default Login;
