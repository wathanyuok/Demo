import { useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import useProductStore from '../store/product-store';

// ประกาศและส่งออกคอมโพเนนต์ Home เป็นค่าเริ่มต้น
export default function Home() {
  // ใช้ destructuring เพื่อดึงค่า products และฟังก์ชัน fetchProducts จาก useProductStore
  const { products, fetchProducts } = useProductStore();

  // ใช้ useEffect เพื่อเรียกฟังก์ชัน fetchProducts เมื่อคอมโพเนนต์ถูกเรนเดอร์ครั้งแรก
  useEffect(() => {
    fetchProducts();
  }, []); // dependency array เป็นค่าว่าง หมายถึงจะทำงานเฉพาะตอน mount

  // เริ่มต้นการ return JSX
  return (
    <div>
      {/* แสดงหัวข้อ "มังงะยอดนิยม" */}
      <h1 className="text-2xl font-bold mb-6">มังงะยอดนิยม</h1>
      
      {/* สร้าง div ที่ใช้ CSS Grid สำหรับการจัดเรียง ProductCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* 
          ใช้ .map() เพื่อวนลูปผ่านอาร์เรย์ products และสร้าง ProductCard สำหรับแต่ละ product
          หมายเหตุ: อาจเกิดข้อผิดพลาดถ้า products เป็น undefined ในตอนแรก
          ควรเพิ่มการตรวจสอบว่า products มีค่าก่อนใช้ .map() หรือกำหนดค่าเริ่มต้นให้เป็นอาร์เรย์ว่างใน useProductStore
        */}
        {products.map((product) => (
          <ProductCard key={product.productID} product={product} />
        ))}
      </div>
    </div>
  );
}
