"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "@/lib/config";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch(  `${BASE_URL}/api/v1/user/me`, {
      credentials: "include",
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
