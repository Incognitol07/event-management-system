"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import EventCalendar from "@/components/calendar/event-calendar";
import ProtectedHeader from "@/components/layout/protected-header";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
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

  const canCreateEvents = user.role === "ADMIN" || user.role === "STAFF";
  return (
    <div className="min-h-screen bg-white">
      <ProtectedHeader currentPage="calendar" />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Calendar component with subtle enhancement */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Page title and description */}
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-gray-900">
              Campus Calendar
            </h1>
            <p className="text-gray-600 mt-2">
              View all campus events in one centralized calendar ✨
            </p>
          </div>
          {canCreateEvents && (
            <button
              onClick={() => router.push("/events/new")}
              className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg group flex justify-between items-center mb-6"
            >
              <span className="transition-all duration-300 group-hover:tracking-wider">
                New Event
              </span>
            </button>
          )}
          {/* Calendar component */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <EventCalendar />
          </div>
          {/* Additional info section */}{" "}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Event Categories
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                  <span className="text-gray-600">Academic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
                  <span className="text-gray-600">Spiritual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                  <span className="text-gray-600">Social</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                  <span className="text-gray-600">Student Org</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
                  <span className="text-gray-600">Sports</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-100 border border-pink-200 rounded"></div>
                  <span className="text-gray-600">Cultural</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => (window.location.href = "/events/new")}
                  className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  → Create New Event
                </button>
                <button
                  onClick={() => (window.location.href = "/events")}
                  className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  → View All Events
                </button>{" "}
                <button
                  onClick={() => (window.location.href = "/locations")}
                  className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  → Manage Venues
                </button>{" "}
                {user.role === "ADMIN" && (
                  <button
                    onClick={() => (window.location.href = "/resources")}
                    className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    → Manage Resources
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-2">Tips</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Click on any date to view events</p>
                <p>• Use arrow keys to navigate months</p>
                <p>• Only approved events are shown</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
