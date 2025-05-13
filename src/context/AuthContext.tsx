"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface AuthContextProps {
  isLoggedIn: boolean;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  checkAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        await api.get("/user/me");
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth(); // 최초 1회 체크

    // storage 이벤트 감지 → 다른 탭 또는 동일 탭에서 localStorage 변경 시
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
