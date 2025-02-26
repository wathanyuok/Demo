import { create } from "zustand";
import { actionLogin } from "../api/auth";
import { persist } from "zustand/middleware";
// Step 1 Create Store
const authStore = (set) => ({
  user: [],
  token: null,
  actionLoginWithZustand: async (value) => {
    try {
      const res = await actionLogin(value);
      // console.log("Hello,Zustandddd",res)
      const { payload, token } = res.data;
      set({ user: payload, token: token });

      return { success: true, role: payload.role };
    } catch (error) {
      return { success: false, error: error.response.data.message };
    }
  },
  actionLogout: () => {
    set({ user: [], token: null });
  },
});
// Step 2 Exports Store
const useAuthStore = create(persist(authStore, { name: "auth-store" }));

export default useAuthStore;