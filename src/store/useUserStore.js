import { create } from "zustand";
import axios from "axios";

const useUserStore = create((set) => ({
  users: [],
  roles: [],
  userData: null,
  error: "",

  fetchUsers: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ users: response.data });
    } catch (error) {
      set({ error: "Failed to fetch users." });
    }
  },

  fetchRoles: async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/roles");
      set({ roles: response.data });
    } catch (error) {
      set({ error: "Failed to fetch roles." });
    }
  },

  fetchUserData: async () => {
    try {
      const response = await fetch("/SampleData/UserData.json");
      const data = await response.json();
      set({ userData: data });
    } catch (error) {
      set({ error: "Failed to fetch user data." });
    }
  },

  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.Id !== userId),
    })),
}));

export default useUserStore;
