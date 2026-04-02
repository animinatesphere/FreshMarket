import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import type { Session } from "@supabase/supabase-js";

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

// Failsafe for admin user
const ADMIN_EMAILS = ["admin@freshmarket.com"];

const isEmailAdmin = (email?: string) => ADMIN_EMAILS.includes(email?.toLowerCase().trim() || "");

console.log("%c[AuthContext] VERSION 3.0 (BULLETPROOF) LOADED", "color: green; font-weight: bold;");

async function fetchProfile(userId: string): Promise<User | null> {
  console.log("[AuthContext] fetchProfile start for:", userId);
  
  // Use Promise.race to guarantee this function returns within 2 seconds
  const dbPromise = supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error("DB_TIMEOUT")), 2000)
  );

  try {
    const result = await Promise.race([dbPromise, timeoutPromise]) as any;
    
    if (result.error) {
      console.error("[AuthContext] DB Error:", result.error.message);
      return null;
    }
    
    if (!result.data) {
      console.warn("[AuthContext] Profile row missing.");
      return null;
    }

    return {
      id: result.data.id,
      email: result.data.email,
      name: result.data.name,
      role: result.data.role as "user" | "admin",
      createdAt: result.data.created_at,
    };
  } catch (err) {
    console.warn("[AuthContext] fetchProfile bypassed (timed out or failed).");
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);       
  const [isInitializing, setIsInitializing] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  const createFallbackUser = (sessionUser: any): User => ({
    id: sessionUser.id,
    email: sessionUser.email || "",
    name: sessionUser.user_metadata?.name || (isEmailAdmin(sessionUser.email) ? "Admin" : "User"),
    role: isEmailAdmin(sessionUser.email) ? "admin" : "user",
    createdAt: sessionUser.created_at
  });

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile || createFallbackUser(session.user));
        }
      } catch (err) {
        console.error("[AuthContext] initSession failed:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session: Session | null) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setUser(profile || createFallbackUser(session.user));
        } else {
          setUser(null);
        }
        setIsInitializing(false);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    console.log("[AuthContext] Login requested:", email);
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (loginError) throw loginError;
      
      if (data.user) {
        console.log("[AuthContext] Auth Success (SignedIn)");
        
        // ADMIN BYPASS: Don't even wait for the database if it's the admin email
        if (isEmailAdmin(data.user.email)) {
            console.log("[AuthContext] ADMIN DETECTED - Bypassing DB check for immediate redirect.");
            const adminUser = createFallbackUser(data.user);
            setUser(adminUser);
            setIsLoading(false);
            return adminUser; 
        }

        const profile = await fetchProfile(data.user.id);
        const finalUser = profile || createFallbackUser(data.user);
        setUser(finalUser);
        return finalUser;
      }
      return null;
    } catch (err: any) {
      console.error("[AuthContext] Login error:", err.message);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (signUpError) throw signUpError;
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          name,
          email,
          role: "user",
        });
      }
    } catch (err: any) {
      setError(err.message || "Signup failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
