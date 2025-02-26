// นำเข้า useState จาก React เพื่อจัดการ state ภายในคอมโพเนนต์
import { useState } from 'react';

// นำเข้า Link และ useNavigate จาก react-router-dom สำหรับการนำทางระหว่างหน้า
import { Link, useNavigate } from 'react-router-dom';

// นำเข้า axios สำหรับการเรียกใช้งาน API
import axios from 'axios';

// นำเข้าไอคอนต่าง ๆ จากไลบรารี lucide-react เพื่อใช้ในแบบฟอร์ม
import { UserPlus, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

// สร้างคอมโพเนนต์ Register สำหรับหน้าสมัครสมาชิก
const Register = () => {
  // ใช้ useNavigate เพื่อสร้างฟังก์ชันสำหรับนำทางไปยังหน้าอื่น
  const navigate = useNavigate();

  // สร้าง state formData เพื่อเก็บข้อมูลที่ผู้ใช้กรอกในแบบฟอร์ม
  const [formData, setFormData] = useState({
    firstname: '',       // ชื่อ
    lastname: '',        // นามสกุล
    email: '',           // อีเมล
    password: '',        // รหัสผ่าน
    confirmPassword: '', // ยืนยันรหัสผ่าน
    phonenumber: '',     // เบอร์โทรศัพท์
    address: ''          // ที่อยู่
  });

  // สร้าง state error สำหรับเก็บข้อความแสดงข้อผิดพลาด
  const [error, setError] = useState('');

  // สร้าง state loading เพื่อตรวจสอบสถานะการโหลด (เช่น ระหว่างส่งข้อมูล)
  const [loading, setLoading] = useState(false);

  // ฟังก์ชัน handleChange สำหรับอัปเดตค่าใน formData เมื่อผู้ใช้กรอกข้อมูลในช่อง input
  const handleChange = (e) => {
    setFormData({
      ...formData,               // คัดลอกค่าปัจจุบันใน formData
      [e.target.name]: e.target.value // อัปเดตค่าของ input ที่ตรงกับ name attribute
    });
  };

  // ฟังก์ชัน handleSubmit สำหรับจัดการเมื่อผู้ใช้กดปุ่ม "สมัครสมาชิก"
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการ reload หน้าเมื่อส่งฟอร์ม

    setError('');       // รีเซ็ตข้อความแสดงข้อผิดพลาดก่อนเริ่มกระบวนการใหม่
    setLoading(true);   // ตั้งสถานะ loading เป็น true ระหว่างส่งข้อมูล

    // ตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกันหรือไม่
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน'); // แสดงข้อความข้อผิดพลาดหากไม่ตรงกัน
      setLoading(false);               // ยกเลิกสถานะ loading
      return;                          // หยุดกระบวนการสมัครสมาชิก
    }

    // ลบค่า confirmPassword ออกจาก formData ก่อนส่งไปยัง API (ไม่จำเป็นต้องส่ง)
    const { confirmPassword, ...dataToSend } = formData;

    try {
      // ส่งคำขอ POST ไปยัง API สำหรับสมัครสมาชิก โดยส่งข้อมูล dataToSend
      await axios.post(
        `${import.meta.env.VITE_URL_SERVER_API}/api/auth/register`, 
        dataToSend
      );

      // หลังจากสมัครสมาชิกสำเร็จ ให้เปลี่ยนเส้นทางไปยังหน้าล็อกอิน (/login)
      navigate('/login');
    } catch (error) {
      // หากเกิดข้อผิดพลาด ให้แสดงข้อความจาก API หรือข้อความเริ่มต้น
      setError(
        error.response?.data?.message || 
        'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setLoading(false); // ยกเลิกสถานะ loading หลังจากกระบวนการเสร็จสิ้นไม่ว่าจะสำเร็จหรือไม่สำเร็จ
    }
  };

  return (
    <>
      {/* พื้นที่หลักของหน้า */}
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-base-100 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full bg-base-100 rounded-2xl shadow-2xl p-8 border border-base-200">
          <div className="text-center mb-8">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-base-content">
              สมัครสมาชิก
            </h1>
            <p className="text-base-content/60 mt-2">
              สร้างบัญชีใหม่เพื่อเริ่มใช้งาน
            </p>
          </div>

          {error && (
            <div className="flex items-center p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-lg shadow-md" role="alert">
              <div
                className="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >

              </div>


              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    ชื่อ
                  </span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="ชื่อ"
                  className="input input-bordered w-full bg-base-100"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    นามสกุล
                  </span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="นามสกุล"
                  className="input input-bordered w-full bg-base-100"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  อีเมล
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="input input-bordered w-full bg-base-100"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  เบอร์โทรศัพท์
                </span>
              </label>
              <input
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                placeholder="0812345678"
                className="input input-bordered w-full bg-base-100"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  ที่อยู่
                </span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="ที่อยู่สำหรับจัดส่ง"
                className="textarea textarea-bordered w-full bg-base-100"
                required
                rows="3"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  รหัสผ่าน
                </span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered w-full bg-base-100"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  ยืนยันรหัสผ่าน
                </span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered w-full bg-base-100"
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </button>
          </form>

          <p className="text-center mt-8 text-base-content/70">
            มีบัญชีอยู่แล้ว?{' '}
            <Link to="/login" className="link link-primary font-medium hover:link-primary-focus">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </main>

    </>
  );
};

export default Register;