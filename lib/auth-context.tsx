"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type UserRole = "admin" | "organizer" | "attendee" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("eventflow_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("eventflow_user");
      }
    }
    // Check for demo login from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const demoRole = urlParams.get("demo");

    if (demoRole && ["admin", "organizer", "attendee"].includes(demoRole)) {
      const demoUsers: Record<string, User> = {
        admin: {
          id: "1",
          name: "Dr. Sarah Admin",
          email: "admin@university.edu",
          role: "admin",
        },
        organizer: {
          id: "2",
          name: "Mike Organizer",
          email: "organizer@university.edu",
          role: "organizer",
        },
        attendee: {
          id: "3",
          name: "Jane Student",
          email: "student@university.edu",
          role: "attendee",
        },
      };

      const demoUser = demoUsers[demoRole];
      if (demoUser) {
        setUser(demoUser);
        localStorage.setItem("eventflow_user", JSON.stringify(demoUser));
        // Clean up URL
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("eventflow_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eventflow_user");
  };

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
      }}
    >
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
