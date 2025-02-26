import { create } from 'zustand';
import axios from 'axios';

const useProductStore = create((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('http://localhost:8000/api/products');
      set({ products: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  setProducts: (products) => {
    set({ products });
  }
}));

export default useProductStore;