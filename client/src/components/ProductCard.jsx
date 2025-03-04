// นำเข้าคอมโพเนนต์ Link จาก react-router-dom สำหรับการสร้างลิงก์ภายในแอพ
import { Link } from 'react-router-dom';

// นำเข้าไอคอน Heart และ ShoppingCart จาก lucide-react
import { Heart, ShoppingCart } from 'lucide-react';

// นำเข้าฟังก์ชัน useState จาก React สำหรับการจัดการสถานะ
import { useState } from 'react';

// นำเข้า axios สำหรับการทำ HTTP requests
import axios from 'axios';

// นำเข้า Swal จาก sweetalert2 สำหรับการแสดง popup แจ้งเตือน
import Swal from 'sweetalert2';

// สร้างคอมโพเนนต์ ProductCard ที่รับ prop ชื่อ product
const ProductCard = ({ product }) => {
  // สร้างสถานะ isHovered สำหรับตรวจสอบว่าเมาส์อยู่เหนือการ์ดหรือไม่
  const [isHovered, setIsHovered] = useState(false);

  return (
    // สร้าง div หลักของการ์ดสินค้า พร้อมกำหนด class และ event handlers
    <div
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      // สร้างลิงก์ไปยังหน้ารายละเอียดสินค้า
      <Link to={`/products/${product.productID}`} className="block relative h-48">
        // แสดงรูปภาพสินค้า
        <img
          src={product.productImage}
          alt={product.productName}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        // สร้าง overlay gradient เมื่อ hover
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`} />




      </Link>


      // ส่วนแสดงข้อมูลสินค้า
      <div className="p-3">
        // ลิงก์ไปยังหน้ารายละเอียดสินค้า
        <Link to={`/products/${product.productID}`}>
          <h3 className="text-sm font-bold mb-1 line-clamp-2 hover:text-purple-600 transition-colors">
            {product.productName}
          </h3>
        </Link>

        <div className="space-y-1.5">

        // แสดงราคาสินค้า
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-purple-600">
              ฿{product.price.toFixed(2)}
            </span>
          </div>


          // แสดงสถานะสินค้าคงเหลือ
          <div className="flex items-center justify-between">
            {product.stockQuantity > 0 ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                มีสินค้า ({product.stockQuantity})
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                สินค้าหมด
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ส่งออกคอมโพเนนต์ ProductCard เพื่อนำไปใช้ในส่วนอื่นของแอพพลิเคชัน
export default ProductCard
