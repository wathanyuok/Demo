import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  
  clearUser: () => set({ user: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },

  reset: () => {
    set({
      user: null,
      isLoading: false,
      error: null
    });
  }
}));

export { useUserStore };