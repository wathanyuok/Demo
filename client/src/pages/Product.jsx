// นำเข้า hooks และ components ที่จำเป็น
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

// สร้าง component Product
const Product = () => {
  // ใช้ hook useSearchParams เพื่อดึงค่า query parameters จาก URL
  const [searchParams] = useSearchParams();
  // ดึงค่า 'search' จาก query parameters
  const searchQuery = searchParams.get('search');
  
  // สร้าง state สำหรับเก็บข้อมูลสินค้าและสถานะการโหลด
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ใช้ useEffect เพื่อเรียกข้อมูลสินค้าเมื่อ component ถูกโหลดหรือ searchQuery เปลี่ยนแปลง
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // เริ่มการโหลด
        setLoading(true);
        // สร้าง URL สำหรับ API request โดยขึ้นอยู่กับว่ามี searchQuery หรือไม่
        const url = searchQuery 
          ? `${import.meta.env.VITE_URL_SERVER_API}/api/products?search=${encodeURIComponent(searchQuery)}`
          : `${import.meta.env.VITE_URL_SERVER_API}/api/products`;
        
        // ส่ง GET request ไปยัง API
        const response = await axios.get(url);
        // อัพเดท state ด้วยข้อมูลที่ได้รับ
        setProducts(response.data);
      } catch (error) {
        // แสดงข้อผิดพลาดในคอนโซลถ้าเกิดปัญหา
        console.error('Error fetching products:', error);
      } finally {
        // สิ้นสุดการโหลด
        setLoading(false);
      }
    };

    // เรียกใช้ฟังก์ชัน fetchProducts
    fetchProducts();
  }, [searchQuery]);

  // แสดง loading skeleton ถ้ากำลังโหลดข้อมูล
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-96 bg-base-200 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  // แสดงผลลัพธ์หลังจากโหลดข้อมูลเสร็จ
  return (
    <div>
      
      {/* แสดงหัวข้อและผลการค้นหา */}
      <div className="mb-8">
        {searchQuery ? (
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Search className="w-8 h-8" />
              ผลการค้นหา: {searchQuery}
            </h1>
            <div className="text-sm text-base-content/50">
              พบสินค้าทั้งหมด {products.length} รายการ
            </div>
          </div>
        ) : (
          <h1 className="text-3xl font-bold mb-2">สินค้าทั้งหมด</h1>
        )}
      </div>

     
      {/* แสดงรายการสินค้าหรือข้อความเมื่อไม่พบสินค้า */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.productID} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <h3 className="text-xl font-semibold">ไม่พบสินค้าที่คุณค้นหา</h3>
          <p className="text-base-content/70 mt-2">
            ลองค้นหาด้วยคำค้นอื่น หรือดูสินค้าทั้งหมดในหมวดหมู่ที่ต้องการ
          </p>
        </div>
      )}
    </div>
  );
};

// ส่งออก component Product
export default Product;
