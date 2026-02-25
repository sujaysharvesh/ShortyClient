"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname(); 

  const PUBLIC_ROUTES = [
    "/login",
    "/register",
    "/serverUn",
    "/server-not-available",
    "/",
    "/logout"
  ];

  const fetchUser = async () => {
    try {
      setLoading(true);

      if (PUBLIC_ROUTES.includes(pathname)) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/user/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status >= 500) {
          router.replace("/server-not-available");
          return;
        }
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);

    } catch (err) {
      console.error("Server is DOWN", err);
      router.replace("/server-not-available");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]); 

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);