import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  uid?: string;
  nickname: string;
  avatar: string;
  phone?: string;
  email?: string;
  gender?: string;
  age?: number;
  city?: string;
  bio?: string;
  level?: string;
  points?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: User, token?: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      
      login: (user, token) => {
        set({
          user,
          token: token || null,
          isLoggedIn: true
        });
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isLoggedIn: false
        });
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      }
    }),
    {
      name: 'goldnine-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn
      })
    }
  )
);
