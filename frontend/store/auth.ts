/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";

type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: string;
  phoneNumber?: string;
  isVerified: boolean;
};

const transformUser = (data: any): User => {

  let role = 'Customer';
  if (data.is_superuser) role = 'Admin';
  else if (data.is_staff) role = 'Staff';

  const newData = {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    isActive: data.is_active,
    role,
    phoneNumber: data.phone_number,
    isVerified: data.is_verified
  };

  return newData;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),

  logout: async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/auth/logout/",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users/me/", {
        withCredentials: true,
      });
      set({ user: transformUser(res.data), isAuthenticated: true, loading: false });
    } catch {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },
}));
