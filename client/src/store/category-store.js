import { create } from 'zustand';
import axios from 'axios';

const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  fetchCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get('http://localhost:8000/api/categories');
      set({ categories: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));

export default useCategoryStore;