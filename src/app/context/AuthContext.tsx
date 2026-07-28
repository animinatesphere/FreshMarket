import React, { createContext, useContext, useState, useEffect } from "react";
import { api, setToken, getToken, ApiError } from "../lib/api";

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
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      if (!getToken()) {
        setIsInitializing(false);
        return;
      }
      try {
        const { user: me } = await api.get<{ user: User }>("/auth/me");
        setUser(me);
      } catch {
        setToken(null);
      } finally {
        setIsInitializing(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { token, user: loggedInUser } = await api.post<{ token: string; user: User }>("/auth/login", {
        email,
        password,
      });
      setToken(token);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { token, user: newUser } = await api.post<{ token: string; user: User }>("/auth/signup", {
        name,
        email,
        password,
      });
      setToken(token);
      setUser(newUser);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Signup failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
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
        isInitializing,
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
