import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

export const useUserStore = create((set) => ({
  users: [],
  roles: [],
  userData: null,
  error: "",

  fetchUsers: async () => {
    try {
      // Fetch users without relying on localStorage for token
      const response = await axiosInstance.get("/api/users");

      if (response.status === 200) {
        set({ users: response.data, error: "" });
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error.response || error);
      set({
        error: error.response?.data?.message || "Failed to fetch users.",
      });
    }
  },

  fetchRoles: async () => {
    try {
      const response = await axiosInstance.get("/api/users/roles");

      if (response.status === 200) {
        set({ roles: response.data, error: "" });
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error.response || error);
      set({
        error: error.response?.data?.message || "Failed to fetch roles.",
      });
    }
  },

  fetchUserData: async () => {
    try {
      const response = await fetch("/SampleData/UserData.json");

      if (response.ok) {
        const data = await response.json();
        set({ userData: data, error: "" });
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      set({ error: "Failed to fetch user data." });
    }
  },

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
      error: "",
    })),

  deleteUser: (userId) =>
    set((state) => {
      const updatedUsers = state.users.filter((user) => user.Id !== userId);

      if (updatedUsers.length === state.users.length) {
        console.warn(`User with ID ${userId} not found.`);
      }

      return { users: updatedUsers, error: "" };
    }),
}));

export default useUserStore;
