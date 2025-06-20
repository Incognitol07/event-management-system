"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import EventCalendar from "@/components/calendar/event-calendar";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-4xl font-light text-gray-400">...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const canCreateEvents = user.role === "ADMIN" || user.role === "STAFF";

  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* Delightful header with subtle animations */}
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="group cursor-default">
              <h1 className="text-xl font-medium text-gray-900 transition-all duration-300 group-hover:scale-105">
                Events
              </h1>
              <div className="text-sm text-gray-600 transition-all duration-300 group-hover:text-gray-800">
                {user.name} • {user.role}
                <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-12">
                  ✦
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-6">
                <span className="text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-1 transition-all duration-300 hover:border-gray-600">
                  Calendar
                </span>
                <button
                  onClick={() => router.push("/events")}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105"
                >
                  Events
                </button>
                <button
                  onClick={() => router.push("/locations")}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105"
                >
                  Venues
                </button>
              </nav>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>{" "}
      {/* Main content with delightful touches */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {canCreateEvents && (
          <div className="mb-6 flex justify-between items-center group">
            <div>
              <h2 className="text-lg font-medium text-gray-900 transition-all duration-300 group-hover:text-gray-700">
                Calendar View
              </h2>
              <p className="text-sm text-gray-600 transition-all duration-300 group-hover:text-gray-800">
                Your events at a glance ✨
              </p>
            </div>
            <button
              onClick={() => router.push("/events/new")}
              className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              <span className="transition-all duration-300 group-hover:tracking-wider">
                New Event
              </span>
            </button>
          </div>
        )}

        {/* Calendar component with subtle enhancement */}
        <div className="bg-white transition-all duration-300 hover:shadow-sm">
          <EventCalendar />
        </div>
      </main>
    </div>
  );
}
