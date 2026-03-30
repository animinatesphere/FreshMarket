import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount and initialize admin user
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("freshmarket_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Initialize admin user if not already created
      const users = JSON.parse(
        localStorage.getItem("freshmarket_users") || "[]",
      );

      // Check if admin user exists
      const adminExists = users.some((u: any) => u.role === "admin");

      if (!adminExists) {
        const adminUser = {
          id: "admin-1",
          name: "Admin",
          email: "admin@freshmarket.com",
          password: "admin123",
          role: "admin",
          createdAt: new Date().toISOString(),
        };
        users.push(adminUser);
        localStorage.setItem("freshmarket_users", JSON.stringify(users));
      }
    } catch (err) {
      console.error("Error initializing auth:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check credentials (for demo purposes)
      const users = JSON.parse(
        localStorage.getItem("freshmarket_users") || "[]",
      );
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password,
      );

      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        createdAt: foundUser.createdAt,
      };

      setUser(userData);
      localStorage.setItem("freshmarket_user", JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const users = JSON.parse(
        localStorage.getItem("freshmarket_users") || "[]",
      );

      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error("Email already registered");
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role: "user" as const,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("freshmarket_users", JSON.stringify(users));

      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt,
      };

      setUser(userData);
      localStorage.setItem("freshmarket_user", JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("freshmarket_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        signup,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
