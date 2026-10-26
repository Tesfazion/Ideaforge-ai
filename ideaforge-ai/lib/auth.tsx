"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, User } from "./api";

const COOKIE_SESSION = "cookie-session";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      localStorage.removeItem("ideaforge_token");
    } catch (error) {
      console.warn("Unable to clear a legacy browser token:", error);
    }
    api.getMe()
      .then((data) => { setToken(COOKIE_SESSION); setUser(data.user); })
      .catch(() => { setToken(null); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    setToken(COOKIE_SESSION);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api.register({ name, email, password });
    setToken(COOKIE_SESSION);
    setUser(data.user);
  };

  const logout = () => {
    void api.logout().catch((error: unknown) => {
      console.error("Logout request failed:", error instanceof Error ? error.message : "unknown error");
    });
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const data = await api.getMe();
        setToken(COOKIE_SESSION);
        setUser(data.user);
      } catch {
        setToken(null);
        setUser(null);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
