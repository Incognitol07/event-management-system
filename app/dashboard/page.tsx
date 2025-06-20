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
      {/* Compact header with navigation */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-medium text-gray-900">Events</h1>
              <div className="text-sm text-gray-600">
                {user.name} • {user.role}
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-6">
                <span className="text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-1">
                  Calendar
                </span>
                <button
                  onClick={() => router.push("/events")}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Events
                </button>
                <button
                  onClick={() => router.push("/locations")}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Venues
                </button>
              </nav>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Main content with massive whitespace */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {canCreateEvents && (
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Calendar View</h2>
            <button
              onClick={() => router.push("/events/new")}
              className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              New Event
            </button>
          </div>
        )}

        {/* Calendar component */}
        <div className="bg-white">
          <EventCalendar />
        </div>
      </main>
    </div>
  );
}
