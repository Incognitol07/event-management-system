"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface ProtectedHeaderProps {
  currentPage?: "calendar" | "events" | "venues" | "profile";
}

export default function ProtectedHeader({ currentPage }: ProtectedHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Navigation */}
          <nav className="flex space-x-8">
            <button
              onClick={() => router.push("/dashboard")}
              className={`text-sm transition-all duration-300 hover:scale-105 ${
                currentPage === "calendar"
                  ? "font-medium text-gray-900 border-b-2 border-gray-900 pb-1"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => router.push("/events")}
              className={`text-sm transition-all duration-300 hover:scale-105 ${
                currentPage === "events"
                  ? "font-medium text-gray-900 border-b-2 border-gray-900 pb-1"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Events
            </button>{" "}
            <button
              onClick={() => router.push("/locations")}
              className={`text-sm transition-all duration-300 hover:scale-105 ${
                currentPage === "venues"
                  ? "font-medium text-gray-900 border-b-2 border-gray-900 pb-1"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Venues
            </button>
            {user?.role === "STUDENT" && (
              <button
                onClick={() => router.push("/profile")}
                className={`text-sm transition-all duration-300 hover:scale-105 ${
                  currentPage === "profile"
                    ? "font-medium text-gray-900 border-b-2 border-gray-900 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Events
              </button>
            )}
          </nav>

          {/* User info and sign out */}
          <div className="flex items-center space-x-6">
            {user && (
              <div className="text-sm text-gray-600">
                {user.name} • {user.role}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
