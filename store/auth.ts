import { create } from "zustand";
import axios from "axios";

type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // clear cookie
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      set({ user: res.data.user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
