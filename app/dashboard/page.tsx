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
        {/* Page title and actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Calendar</h1>
            <p className="text-sm text-gray-600 mt-1">
              Your events at a glance ✨
            </p>
          </div>
          {canCreateEvents && (
            <button
              onClick={() => router.push("/events/new")}
              className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              <span className="transition-all duration-300 group-hover:tracking-wider">
                New Event
              </span>
            </button>
          )}
        </div>

        {/* Calendar component with subtle enhancement */}
        <div className="bg-white transition-all duration-300 hover:shadow-sm">
          <EventCalendar />
        </div>
      </main>
    </div>
  );
}
