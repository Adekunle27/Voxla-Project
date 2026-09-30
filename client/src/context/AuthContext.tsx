import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: "BUYER" | "SUPPLIER",
    businessName?: string,
    city?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("voxla_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function hydrate() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        localStorage.removeItem("voxla_token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("voxla_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  }

  async function register(
    name: string,
    email: string,
    password: string,
    role: "BUYER" | "SUPPLIER" = "BUYER",
    businessName?: string,
    city?: string
  ) {
    const res = await api.post("/auth/register", { name, email, password, role, businessName, city });
    localStorage.setItem("voxla_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    localStorage.removeItem("voxla_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
