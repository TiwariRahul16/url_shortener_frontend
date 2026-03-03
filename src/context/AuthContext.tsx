// src/context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getAccessToken, setTokens, clearTokens } from "@/lib/token";

interface User {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Start with loading as true so we don't flash unprotected content
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  // 🔥 Validate token on app load
  useEffect(() => {
    const validateAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        // Token is invalid or expired
        clearTokens();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const res = await api.post("/api/auth/login", data);
    
    // Use our new secure token setter
    setTokens(res.data.accessToken, res.data.refreshToken);

    // Fetch user info immediately after login
    const userRes = await api.get("/api/auth/me");
    setUser(userRes.data.user);
    setIsAuthenticated(true);
  };

  const register = async (data: { email: string; password: string }) => {
    const res = await api.post("/api/auth/register", data);
    
    setTokens(res.data.accessToken, res.data.refreshToken);

    const userRes = await api.get("/api/auth/me");
    setUser(userRes.data.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login"); // Client-side routing for faster perceived performance
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};