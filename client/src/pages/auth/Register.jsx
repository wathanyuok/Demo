import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  // สร้าง state formData เพื่อเก็บข้อมูลที่ผู้ใช้กรอกในแบบฟอร์ม
  const [formData, setFormData] = useState({
    firstname: '',       
    lastname: '',      
    email: '',           
    password: '',        
    confirmPassword: '', 
    phonenumber: '',    
    address: ''         
  });

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  // ฟังก์ชัน handleChange สำหรับอัปเดตค่าใน formData เมื่อผู้ใช้กรอกข้อมูลในช่อง input
  const handleChange = (e) => {
    setFormData({
      ...formData,             
      [e.target.name]: e.target.value 
    });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    setError('');       
    setLoading(true);  

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน'); 
      setLoading(false);              
      return;                        
    }

    // ลบค่า confirmPassword ออกจาก formData ก่อนส่งไปยัง API (ไม่จำเป็นต้องส่ง)
    const { confirmPassword, ...dataToSend } = formData;

    try {
      // ส่งคำขอ POST ไปยัง API สำหรับสมัครสมาชิก โดยส่งข้อมูล dataToSend
      await axios.post(
        `${import.meta.env.VITE_URL_SERVER_API}/api/auth/register`, 
        dataToSend
      );

      navigate('/login');
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setLoading(false); 
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