import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Swal from 'sweetalert2';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState('');


  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_SERVER_API}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setCartItems(response.data);
      setLoading(false);

      if (window.updateCartCount) {
        window.updateCartCount();
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('ไม่สามารถโหลดข้อมูลตะกร้าสินค้าได้');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (cartItemID, newQty) => {
    if (newQty < 1) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_URL_SERVER_API}/api/cart/${cartItemID}`,
        { quantity: newQty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.message || 'ไม่สามารถอัพเดทจำนวนสินค้าได้',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };


  const removeItem = async (cartItemID) => {
    try {
      await Swal.fire({
        title: 'ยืนยันการลบ',
        text: 'คุณต้องการลบสินค้านี้ออกจากตะกร้าใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ใช่, ลบเลย',
        cancelButtonText: 'ยกเลิก'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(
            `${import.meta.env.VITE_URL_SERVER_API}/api/cart/${cartItemID}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          fetchCartItems();
          Swal.fire({
            icon: 'success',
            title: 'ลบสินค้าสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    } catch (error) {
      console.error('Error removing item:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.message || 'ไม่สามารถลบสินค้าได้',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };


  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.qty * item.product.price), 0);
  };



  const handleCheckout = async () => {
    if (!showCheckout) {
      setShowCheckout(true);
      return;
    }
    if (address == "") {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        text: 'กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบทุกช่อง',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL_SERVER_API}/api/orders`,
        {
          address,
          items: cartItems,
          total: calculateTotal()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      await Swal.fire({
        icon: 'success',
        title: 'สั่งซื้อสำเร็จ',
        text: 'ขอบคุณสำหรับการสั่งซื้อ',
        confirmButtonText: 'ดูรายการสั่งซื้อ'
      });

      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.message || 'ไม่สามารถสร้างคำสั่งซื้อได้',
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <ShoppingBag className="w-16 h-16 text-base-content/30" />
        <h2 className="text-2xl font-bold text-base-content/70">ตะกร้าว่างเปล่า</h2>
        <p className="text-base-content/50">ยังไม่มีสินค้าในตะกร้า</p>
        <a href="/products" className="btn btn-primary">
          เลือกซื้อสินค้า
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {showCheckout ? 'สรุปรายการสั่งซื้อ' : 'ตะกร้าสินค้า'}
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.cartID} className="card card-side bg-base-100 shadow-xl">
              <figure className="w-32 h-32">
                <img
                  src={item.product.productImage}
                  alt={item.product.productName}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{item.product.productName}</h2>

                <div className="space-y-1">
                  <p className="text-primary font-semibold">
                    ฿{item.product.price.toLocaleString()}
                  </p>
                </div>

                {!showCheckout && (
                  <div className="flex items-center gap-4">
                    <div className="join">
                      <button
                        className="btn btn-sm join-item"
                        onClick={() => updateQuantity(item.cartID, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        className="join-item w-16 text-center"
                        value={item.qty}
                        readOnly
                      />
                      <button
                        className="btn btn-sm join-item"
                        onClick={() => updateQuantity(item.cartID, item.qty + 1)}
                        disabled={item.qty >= item.product.stockQuantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => removeItem(item.cartID)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <p className="text-sm text-base-content/60">
                  รวม: ฿{(item.qty * item.product.price).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-base-100 shadow-xl h-fit">
          <div className="card-body">
            <h2 className="card-title">สรุปคำสั่งซื้อ</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>จำนวนสินค้า</span>
                <span>{cartItems.reduce((sum, item) => sum + item.qty, 0)} ชิ้น</span>
              </div>

              <div className="flex justify-between items-center text-lg font-bold">
                <span>ยอดรวม</span>
                <span>฿{calculateTotal().toLocaleString()}</span>
              </div>

              {showCheckout && (
                <div className="space-y-4 pt-4">
                  <h3 className="font-medium">ข้อมูลจัดส่ง</h3>
                  <div className="form-control">
                    <textarea
                      placeholder="ที่อยู่จัดส่ง"
                      className="textarea textarea-bordered"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button
                className="btn btn-primary w-full"
                onClick={handleCheckout}
              >
                {showCheckout ? 'ยืนยันการสั่งซื้อ' : 'ดำเนินการสั่งซื้อ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};




export default Cart;