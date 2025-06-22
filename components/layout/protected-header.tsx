"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

interface ProtectedHeaderProps {
  currentPage?:
    | "calendar"
    | "events"
    | "venues"
    | "profile"
    | "resources"
    | "organizer";
}

export default function ProtectedHeader({ currentPage }: ProtectedHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navigateAndClose = (path: string) => {
    router.push(path);
    closeMobileMenu();
  };

  return (
    <header className="border-b border-gray-100 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {/* Calendar - All roles */}
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

            {/* Events - All roles */}
            <button
              onClick={() => router.push("/events")}
              className={`text-sm transition-all duration-300 hover:scale-105 ${
                currentPage === "events"
                  ? "font-medium text-gray-900 border-b-2 border-gray-900 pb-1"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Events
            </button>

            {/* Venues - All roles */}
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

            {/* Profile - Students only */}
            {user?.role === "STUDENT" && (
              <button
                onClick={() => router.push("/profile")}
                className={`text-sm transition-all duration-300 hover:scale-105 ${
                  currentPage === "profile"
                    ? "font-medium text-gray-900 border-b-2 border-gray-900 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Profile
              </button>
            )}

            {/* My Events - Organizers only */}
            {user?.role === "ORGANIZER" && (
              <button
                onClick={() => router.push("/organizer")}
                className={`text-sm transition-all duration-300 hover:scale-105 ${
                  currentPage === "organizer"
                    ? "font-medium text-gray-900 border-b-2 border-gray-900 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                My Events
              </button>
            )}

            {/* Resources - Admin only */}
            {user?.role === "ADMIN" && (
              <button
                onClick={() => router.push("/resources")}
                className={`text-sm transition-all duration-300 hover:scale-105 ${
                  currentPage === "resources"
                    ? "font-medium text-gray-900 border-b-2 border-gray-900 pb-1"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Resources
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 touch-manipulation"
            aria-label="Toggle mobile menu"
          >
            <div className="space-y-1.5">
              <div
                className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></div>
            </div>
          </button>

          {/* User info and logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <nav className="pt-4 pb-2 space-y-2">
            {/* Calendar - All roles */}
            <button
              onClick={() => navigateAndClose("/dashboard")}
              className={`block w-full text-left px-3 py-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${
                currentPage === "calendar"
                  ? "font-medium text-gray-900 bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Calendar
            </button>

            {/* Events - All roles */}
            <button
              onClick={() => navigateAndClose("/events")}
              className={`block w-full text-left px-3 py-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${
                currentPage === "events"
                  ? "font-medium text-gray-900 bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Events
            </button>

            {/* Venues - All roles */}
            <button
              onClick={() => navigateAndClose("/locations")}
              className={`block w-full text-left px-3 py-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${
                currentPage === "venues"
                  ? "font-medium text-gray-900 bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Venues
            </button>

            {/* Profile - Students only */}
            {user?.role === "STUDENT" && (
              <button
                onClick={() => navigateAndClose("/profile")}
                className={`block w-full text-left px-3 py-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${
                  currentPage === "profile"
                    ? "font-medium text-gray-900 bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Profile
              </button>
            )}

            {/* My Events - Organizers only */}
            {user?.role === "ORGANIZER" && (
              <button
                onClick={() => navigateAndClose("/organizer")}
                className={`block w-full text-left px-3 py-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${
                  currentPage === "organizer"
                    ? "font-medium text-gray-900 bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                My Events
              </button>
            )}

            {/* Resources - Admin only */}
            {user?.role === "ADMIN" && (
              <button
                onClick={() => navigateAndClose("/resources")}
                className={`block w-full text-left px-3 py-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${
                  currentPage === "resources"
                    ? "font-medium text-gray-900 bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Resources
              </button>
            )}

            {/* User info and logout in mobile */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="px-3 py-2 text-sm text-gray-600">
                {user?.name} ({user?.role})
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 touch-manipulation"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
