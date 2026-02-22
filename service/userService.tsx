import { API_URL, BASE_URL } from "@/lib/config"

export const userService = {
    async getCurrentUser() {
      console.log("Fetching current user data from", `${API_URL}/user/me`);
      try {
        const res = await fetch(`${API_URL}/user/me`, {
          credentials: "include",
        });
  
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        console.log("getCurrentUser response", res);
  
        return await res.json();
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    },
  
    async login(email: string, password: string) {
      try {
        const res = await fetch(`${API_URL}/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
  
        if (!res.ok) {
          throw new Error("Login failed");
        }
  
        return await res.json();
      } catch (error) {
        console.error("Error during login:", error);
        throw error;
      }
    },
  
    async register(username: string, email: string, password: string) {
      try {
        const res = await fetch(`${API_URL}/user/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, email, password }),
        });
  
        if (!res.ok) {
          throw new Error("Registration failed");
        }
  
        return await res.json();
      } catch (error) {
        console.error("Error during registration:", error);
        throw error;
      }
    },
  };
  