import { create } from 'zustand';
import axios from 'axios';

const useCartStore = create((set, get) => ({
  cartItems: [],
  isLoading: false,
  error: null,

  // เพิ่มสินค้าลงตะกร้า
  addToCart: async (productID, qty = 1) => {
    set({ isLoading: true });
    try {
      // TODO: ต้องเปลี่ยน customerID ตามระบบ authentication ของคุณ
      const customerID = localStorage.getItem('customerID');
      
      const response = await axios.post('http://localhost:8000/api/cart', {
        customerID,
        productID,
        qty
      });
      
      // อัพเดทรายการในตะกร้า
      const cartItems = get().cartItems;
      set({ 
        cartItems: [...cartItems, response.data],
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // ดึงข้อมูลตะกร้า
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ cartItems: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));

export default useCartStore;