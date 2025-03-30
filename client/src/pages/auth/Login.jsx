import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../../store/user-store';
import { LogIn, Mail, Lock } from 'lucide-react';
import Swal from 'sweetalert2';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [error, setError] = useState("");

  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL_SERVER_API}/api/auth/login`,
        {
          email,
          password,
        }
      );

      const token = response.data.token;
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

      await Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        text: 'ยินดีต้อนรับกลับ!',
        timer: 1500,
        showConfirmButton: false,
        position: 'top',
        backdrop: false
      });

      // เปลี่ยนเส้นทางไปยังหน้าแรกของเว็บไซต์ (/)
      navigate("/");
    } catch (err) {
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

export default Login;
