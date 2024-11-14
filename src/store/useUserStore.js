import { create } from "zustand";

const useUserStore = create((set) => ({
  role: "read", // Default role
  isAuthenticated: false,
  setRole: (newRole) => set({ role: newRole }),
  setIsAuthenticated: (status) => set({ isAuthenticated: status }),
  loadUserFromLocalStorage: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.Role) {
      set({ role: user.Role, isAuthenticated: true });
    }
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ role: "read", isAuthenticated: false });
  },
}));

export default useUserStore;
