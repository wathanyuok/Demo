import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Minus, ShoppingCart, Tag } from 'lucide-react';
import Swal from 'sweetalert2';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_SERVER_API}/api/products/${id}`
      );
      setProduct(response.data);
      console.log("response.data", response.data)
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;

    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      await Swal.fire({
        icon: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'คุณต้องเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า',
        showCancelButton: true,
        confirmButtonText: 'เข้าสู่ระบบ',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_URL_SERVER_API}/api/cart`,
        {
          productID: id,
          quantity: quantity,
          price: product.price
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await Swal.fire({
        icon: 'success',
        title: 'เพิ่มลงตะกร้าสำเร็จ',
        text: 'เพิ่มสินค้าลงในตะกร้าเรียบร้อยแล้ว',
        showCancelButton: true,
        confirmButtonText: 'ไปที่ตะกร้า',
        cancelButtonText: 'เลือกซื้อต่อ'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/cart');
        }
      });

      if (window.updateCartCount) {
        window.updateCartCount();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
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
        </div>
  
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.productName}</h1>
  
          <div className="space-y-2">
            <span className="text-2xl font-bold text-primary">
              ฿{product.price.toLocaleString()}
            </span>
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
