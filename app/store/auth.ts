import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
};

type Auth = {
  username: string;
  password: string;
};

export const Auth_KEY = "auth";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      username: "",
      password: "",
      setUsername(username: string) {
        set((state) => ({ username }));
      },
      setPassword(password: string) {
        set((state) => ({ password }));
      },
    }),
    {
      name: Auth_KEY,
      version: 1,
    },
  ),
);
