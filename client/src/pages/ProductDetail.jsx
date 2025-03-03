// นำเข้า hooks จาก React
import { useState, useEffect } from 'react';
// นำเข้า hooks สำหรับการจัดการ routing
import { useParams, useNavigate } from 'react-router-dom';
// นำเข้า axios สำหรับการทำ HTTP requests
import axios from 'axios';
// นำเข้า icons จาก lucide-react
import { Plus, Minus, ShoppingCart, Tag } from 'lucide-react';
// นำเข้า Swal จาก sweetalert2 สำหรับแสดง popup
import Swal from 'sweetalert2';

// สร้าง component ProductDetail
const ProductDetail = () => {
  // ดึงค่า id จาก URL parameters
  const { id } = useParams();
  // สร้างฟังก์ชันสำหรับการนำทาง
  const navigate = useNavigate();
  // สร้าง state สำหรับเก็บข้อมูลสินค้า
  const [product, setProduct] = useState(null);
  // สร้าง state สำหรับสถานะการโหลด
  const [loading, setLoading] = useState(true);
  // สร้าง state สำหรับเก็บข้อความผิดพลาด
  const [error, setError] = useState('');
  // สร้าง state สำหรับเก็บจำนวนสินค้าที่เลือก
  const [quantity, setQuantity] = useState(1);

  // ใช้ useEffect เพื่อเรียกใช้ฟังก์ชัน fetchProduct เมื่อ component ถูกโหลดหรือ id เปลี่ยนแปลง
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้าจาก API
  const fetchProduct = async () => {
    try {
      // ส่ง GET request ไปยัง API
      const response = await axios.get(
        `${import.meta.env.VITE_URL_SERVER_API}/api/products/${id}`
      );
      // อัปเดต state product ด้วยข้อมูลที่ได้รับ
      setProduct(response.data);
      // แสดงข้อมูลที่ได้รับในคอนโซล
      console.log("response.data", response.data)
    } catch (error) {
      // แสดงข้อผิดพลาดในคอนโซล
      console.error('Error fetching product:', error);
      // อัปเดต state error ด้วยข้อความแสดงข้อผิดพลาด
      setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
      // อัปเดตสถานะการโหลดเป็นเสร็จสิ้น
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงจำนวนสินค้า
  const handleQuantityChange = (value) => {
    // คำนวณจำนวนสินค้าใหม่โดยเพิ่มหรือลด value จากจำนวนปัจจุบัน
    const newQuantity = quantity + value;

    // ตรวจสอบว่าจำนวนใหม่อยู่ในช่วงที่ถูกต้อง (ไม่น้อยกว่า 1 และไม่เกินจำนวนในสต็อก)
    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
      // ถ้าเงื่อนไขเป็นจริง, อัปเดต state quantity ด้วยค่าใหม่
      setQuantity(newQuantity);
    }
  };


  // ฟังก์ชันสำหรับคำนวณราคาสินค้า โดยคำนึงถึงส่วนลด (ถ้ามี)
  const calculatePrice = () => {
    // ตรวจสอบว่ามีข้อมูลสินค้าหรือไม่ ถ้าไม่มีให้คืนค่า 0
    if (!product) return 0;

    // ตรวจสอบว่าสินค้ามีส่วนลดหรือไม่
    if (product.discount) {
      // ถ้ามีส่วนลด คำนวณราคาหลังหักส่วนลด
      // โดยลบส่วนลด (คิดเป็นเปอร์เซ็นต์) ออกจากราคาเต็ม
      return product.price - (product.price * (product.discount / 100));
    }

    // ถ้าไม่มีส่วนลด คืนค่าราคาปกติของสินค้า
    return product.price;
  };


  // ฟังก์ชันสำหรับจัดการการเพิ่มสินค้าลงตะกร้า
  const handleAddToCart = async () => {
    // ดึง token จาก localStorage
    const token = localStorage.getItem('token');

    // ตรวจสอบว่ามี token หรือไม่ (ผู้ใช้ล็อกอินหรือยัง)
    if (!token) {
      // ถ้าไม่มี token แสดง SweetAlert เตือนให้เข้าสู่ระบบ
      await Swal.fire({
        icon: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'คุณต้องเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า',
        showCancelButton: true,
        confirmButtonText: 'เข้าสู่ระบบ',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        // ถ้าผู้ใช้กดปุ่มยืนยัน ให้นำทางไปหน้าล็อกอิน
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      // ออกจากฟังก์ชันถ้าไม่มี token
      return;
    }

    try {
      // ส่ง POST request ไปยัง API เพื่อเพิ่มสินค้าลงตะกร้า
      await axios.post(
        `${import.meta.env.VITE_URL_SERVER_API}/api/cart`,
        {
          productID: id,
          quantity: quantity,
          price: product.discountedPrice || product.price // ใช้ราคาที่ลดแล้วถ้ามี ไม่งั้นใช้ราคาปกติ
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // แนบ token สำหรับการยืนยันตัวตน
          }
        }
      );

      // แสดง SweetAlert แจ้งเตือนว่าเพิ่มสินค้าลงตะกร้าสำเร็จ
      await Swal.fire({
        icon: 'success',
        title: 'เพิ่มลงตะกร้าสำเร็จ',
        text: 'เพิ่มสินค้าลงในตะกร้าเรียบร้อยแล้ว',
        showCancelButton: true,
        confirmButtonText: 'ไปที่ตะกร้า',
        cancelButtonText: 'เลือกซื้อต่อ'
      }).then((result) => {
        // ถ้าผู้ใช้กดปุ่มยืนยัน ให้นำทางไปหน้าตะกร้า
        if (result.isConfirmed) {
          navigate('/cart');
        }
      });

      // อัพเดทจำนวนสินค้าในตะกร้า (ถ้ามีฟังก์ชันนี้)
      if (window.updateCartCount) {
        window.updateCartCount();
      }
    } catch (error) {
      // จัดการกับข้อผิดพลาดที่อาจเกิดขึ้น
      console.error('Error adding to cart:', error);
      // แสดง SweetAlert แจ้งเตือนข้อผิดพลาด
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.message || 'ไม่สามารถเพิ่มสินค้าลงตะกร้าได้',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <span>ไม่พบสินค้า</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">

        <div className="aspect-square rounded-2xl overflow-hidden relative">
          <img
            src={product.productImage}
            alt={product.productName}
            className="w-full h-full object-cover"
          />
          {product.discount > 0 && (
            <div className="absolute top-4 right-4 bg-error text-error-content px-3 py-1 rounded-full flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>ลด {product.discount}%</span>
            </div>
          )}
        </div>


        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.productName}</h1>

          <div className="space-y-2">
            {product.discountedPrice ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
                    ฿{product.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-base-content/60 line-through">
                    ฿{product.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-error">
                  <Tag className="w-4 h-4" />
                  <span>
                    {product.discountType === 'percentage' ? (
                      <>ลด {product.discounts[0].discountValue}%</>
                    ) : (
                      <>ลด ฿{product.discounts[0].discountValue.toLocaleString()}</>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-error">
                  <span>ประหยัด ฿{(product.price - product.discountedPrice).toLocaleString()}</span>
                </div>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">
                ฿{product.price.toLocaleString()}
              </span>
            )}
            <div className="text-base-content/60">
              สินค้าคงเหลือ: {product.stockQuantity} ชิ้น
            </div>
          </div>

          <p className="text-base-content/80">{product.description}</p>

          <div className="space-y-4">

            <div className="flex items-center gap-4">
              <span className="font-medium">จำนวน:</span>
              <div className="join">
                <button
                  className="btn btn-sm join-item"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  className="join-item w-16 text-center"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn btn-sm join-item"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stockQuantity}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>


            <button
              className="btn btn-primary w-full gap-2"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stockQuantity === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
            </button>
          </div>


          <div className="divider"></div>
          <div className="space-y-2">
            <h3 className="font-medium">รายละเอียดสินค้า</h3>
            <ul className="space-y-2 text-base-content/70">
              <li>รหัสสินค้า: {product.productID}</li>
              <li>หมวดหมู่: {product.category?.categoryName || 'ไม่ระบุ'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;