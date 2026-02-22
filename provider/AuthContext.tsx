"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { API_URL, BASE_URL } from "@/lib/config";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/user/me`, {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);