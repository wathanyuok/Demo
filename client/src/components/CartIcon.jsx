import { useEffect } from 'react';
import { ShoppingCart } from 'lucide-react'; // ไอคอนรูปตะกร้าจาก lucide-react
import useCartStore from '../store/cart-store';

const CartIcon = () => {
  const { cartItems, fetchCart } = useCartStore();


  useEffect(() => {
    fetchCart();
  }, []);

  
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="relative cursor-pointer">
      <ShoppingCart className="w-6 h-6" />
    
      {totalItems > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {totalItems}
        </div>
      )}
    </div>
  );
};

export default CartIcon;