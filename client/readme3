import CartIcon from './CartIcon';
import { Search, Home, BookOpen, LogIn, UserPlus, ShoppingCart, LogOut, User, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUserStore } from '../store/user-store';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useUserStore((state) => ({
    user: state.user,
    logout: state.logout
  }));
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_URL_SERVER_API}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const totalItems = response.data.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  window.updateCartCount = fetchCartCount;

  const handleLogout = async () => {
    Swal.fire({
      title: 'ต้องการออกจากระบบ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        setCartCount(0);
        navigate('/');
        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบสำเร็จ',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-base-100 shadow-lg">
      {/* Top Bar */}
      {/* <div className="bg-gradient-to-r from-purple-600 to-pink-600"> */}
      <div className="bg-gradient-to-r from-pink-400 via-blue-300 to-green-300 p-6 shadow-lg">        

        <div className="container mx-auto">
          <div className="flex h-10 items-center justify-end px-4 text-white">
            <div className="flex items-center gap-6 text-sm font-medium">
              {user ? (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-sm text-white">
                    <User className="w-4 h-4 mr-1" />
                    {user.email}
                  </label>
                  <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 mt-4">
                    <li>
                      <Link to="/orders" className="text-base-content">รายการสั่งซื้อ</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="text-error">
                        <LogOut className="w-4 h-4" />
                        ออกจากระบบ
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <Link to="/login" className="hover:text-purple-200 transition-colors">
                    <LogIn className="w-4 h-4 inline mr-1" />
                    เข้าสู่ระบบ
                  </Link>
                  <Link to="/register" className="hover:text-purple-200 transition-colors">
                    <UserPlus className="w-4 h-4 inline mr-1" />
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

  
      <div className="bg-base-100">
        <div className="container mx-auto">
          <div className="flex h-20 items-center gap-8 px-4">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              
              Anime Spirit
            </Link>

         
            <div className="flex-1 max-w-2xl">
              <form onSubmit={handleSearch}>
                <div className="join w-full">
                  <input
                    type="text"
                    placeholder="ค้นหามังงะที่คุณชื่นชอบ..."
                    className="input join-item w-full bg-base-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="btn join-item bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

      
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                to="/" 
                className="btn btn-ghost btn-sm hover:bg-purple-100"
              >
                <Home className="w-4 h-4" />
                <span>หน้าแรก</span>
              </Link>
              <Link 
                to="/products" 
                className="btn btn-ghost btn-sm hover:bg-purple-100"
              >
                <BookOpen className="w-4 h-4" />
                <span>มังงะ</span>
              </Link>
              <Link 
                to="/contact" 
                className="btn btn-ghost btn-sm hover:bg-purple-100"
              >
                <MapPin className="w-4 h-4" />
                <span>ติดต่อเรา</span>
              </Link>
              <Link 
                to="/cart" 
                className="btn btn-ghost btn-sm hover:bg-purple-100 relative"
              >
                <CartIcon />
              </Link>
            </nav>
            
            <button className="btn btn-square btn-ghost md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Header;