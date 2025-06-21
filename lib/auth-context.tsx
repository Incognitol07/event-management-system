"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "ORGANIZER" | "STUDENT";
  matricNo?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (role: string | string[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Demo users for quick testing
  const demoUsers: Record<string, User> = {
    "admin@cu.edu.ng": {
      id: 1,
      name: "Admin User",
      email: "admin@cu.edu.ng",
      role: "ADMIN",
    },
    "coordinator@cu.edu.ng": {
      id: 2,
      name: "John Coordinator",
      email: "coordinator@cu.edu.ng",
      role: "ORGANIZER",
    },
    "alice@cu.edu.ng": {
      id: 3,
      name: "Alice Student",
      email: "alice@cu.edu.ng",
      role: "STUDENT",
      matricNo: "ST001",
    },
    "bob@cu.edu.ng": {
      id: 4,
      name: "Bob Student",
      email: "bob@cu.edu.ng",
      role: "STUDENT",
      matricNo: "ST002",
    },
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Set cookie for middleware access
      document.cookie = `currentUser=${JSON.stringify(
        userData
      )}; path=/; max-age=86400`; // 24 hours
    }
    setIsLoading(false);
  }, []);
  const login = async (email: string): Promise<boolean> => {
    try {
      // Try API first
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        // Set cookie for middleware access
        document.cookie = `currentUser=${JSON.stringify(
          userData
        )}; path=/; max-age=86400`; // 24 hours
        return true;
      }
    } catch (error) {
      console.error("API login failed, using demo users:", error);
    } // Fallback to demo users
    const userData = demoUsers[email];
    if (userData) {
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      // Set cookie for middleware access
      document.cookie = `currentUser=${JSON.stringify(
        userData
      )}; path=/; max-age=86400`; // 24 hours
      return true;
    }
    return false;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    // Clear cookie
    document.cookie =
      "currentUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
