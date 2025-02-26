// นำเข้า Outlet จาก react-router-dom เพื่อแสดงเนื้อหาของ route ย่อยในเลย์เอาต์นี้
import { Outlet } from 'react-router-dom';

// นำเข้า Header คอมโพเนนต์ส่วนหัวของหน้า
import Header from '../components/Header';

// นำเข้า Footer คอมโพเนนต์ส่วนท้ายของหน้า
import Footer from '../components/Footer';

// นำเข้า CategoryMenu คอมโพเนนต์เมนูหมวดหมู่ที่จะแสดงด้านซ้ายของหน้า
import CategoryMenu from '../components/CategoryMenu';

// นำเข้า useEffect จาก React เพื่อจัดการ side effects
import { useEffect } from 'react';

// นำเข้า useUserStore ซึ่งเป็น custom hook สำหรับจัดการสถานะผู้ใช้ (user)
import { useUserStore } from '../store/user-store';

// นำเข้า axios สำหรับเรียกใช้งาน API
import axios from 'axios';

// สร้างคอมโพเนนต์ PublicLayout ซึ่งเป็นเลย์เอาต์สำหรับหน้าสาธารณะ
const PublicLayout = ({ children }) => {
    // ใช้ useUserStore เพื่อดึงข้อมูลสถานะของผู้ใช้ (user) และฟังก์ชัน setUser เพื่ออัปเดตสถานะ
    const { user, setUser } = useUserStore((state) => ({
        user: state.user,       // ดึงข้อมูลผู้ใช้จาก store
        setUser: state.setUser  // ดึงฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้ใน store
    }));

    // ดึง token จาก localStorage เพื่อตรวจสอบสิทธิ์ผู้ใช้
    const token = localStorage.getItem('token');

    // ใช้ useEffect เพื่อจัดการการโหลดข้อมูลผู้ใช้เมื่อคอมโพเนนต์ถูกเรนเดอร์ครั้งแรก
    useEffect(() => {
        // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก API
        const fetchUser = async () => {
            // ตรวจสอบว่ามี token และยังไม่มีข้อมูลผู้ใช้ใน state หรือไม่
            if (token && !user) {
                try {
                    // เรียก API เพื่อดึงข้อมูลผู้ใช้โดยส่ง token ในส่วนของ Authorization header
                    const response = await axios.get(
                        `${import.meta.env.VITE_URL_SERVER_API}/api/auth/me`, // URL ของ API (ดึงมาจาก environment variable)
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // ส่ง token เพื่อยืนยันตัวตน
                            },
                        }
                    );
                    // หากดึงข้อมูลสำเร็จ ให้ตั้งค่าผู้ใช้ใน store ด้วยข้อมูลที่ได้จาก API
                    setUser(response.data);
                } catch (error) {
                    // หากเกิดข้อผิดพลาด เช่น token หมดอายุ หรือ API ล้มเหลว
                    console.error('Error fetching user:', error); // แสดงข้อผิดพลาดในคอนโซล

                    // ลบ token ออกจาก localStorage เพราะไม่สามารถใช้งานได้อีกต่อไป
                    localStorage.removeItem('token');

                    // ตั้งค่าผู้ใช้ใน store เป็น null เพื่อแสดงว่าไม่มีผู้ใช้งานอยู่ในระบบ
                    setUser(null);
                }
            }
        };

        // เรียกฟังก์ชัน fetchUser เมื่อ useEffect ทำงาน
        fetchUser();
    }, [token, user, setUser]); // useEffect จะทำงานใหม่เมื่อค่า token, user หรือ setUser เปลี่ยนแปลง

    return (
        // โครงสร้างหลักของเลย์เอาต์ โดยกำหนดให้มีความสูงขั้นต่ำเต็มหน้าจอและพื้นหลังสี base-100 (ตาม Tailwind CSS)
        <div className="min-h-screen bg-base-100">
            {/* ส่วนหัวของหน้า */}
            <Header />

            {/* พื้นที่เนื้อหาหลักของหน้า */}
            <div className="container mx-auto px-4 py-8">
                {/* จัดวางเนื้อหาเป็น Flexbox โดยมีช่องว่างระหว่างเมนูและเนื้อหาหลัก */}
                <div className="flex gap-8">
                    {/* เมนูหมวดหมู่ (CategoryMenu) ที่จะปรากฏเฉพาะในหน้าจอขนาดใหญ่ */}
                    <div className="hidden md:block sticky top-8">
                        <CategoryMenu />
                    </div>

                    {/* พื้นที่สำหรับเนื้อหาหลักที่จะแสดงเนื้อหา route ย่อยผ่าน Outlet */}
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* ส่วนท้ายของหน้า */}
            <Footer />
        </div>
    );
};

// ส่งออกคอมโพเนนต์ PublicLayout เพื่อให้สามารถใช้งานในไฟล์อื่นได้
export default PublicLayout;
