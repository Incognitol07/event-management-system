"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import EventCalendar from "@/components/calendar/event-calendar";
import { Calendar, Users, MapPin, Plus, LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Event Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-gray-500">{user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600">
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => router.push("/events")}
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <Users className="w-4 h-4" />
              <span>Events</span>
            </button>
            <button
              onClick={() => router.push("/locations")}
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <MapPin className="w-4 h-4" />
              <span>Venues</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          {canCreateEvents && (
            <button
              onClick={() => router.push("/events/new")}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Welcome, {user.name}!
          </h3>
          <p className="text-gray-600">
            {user.role === "ADMIN" &&
              "You have full access to manage events, venues, and approve event proposals."}
            {user.role === "STAFF" &&
              "You can create and manage events. All events require admin approval."}
            {user.role === "STUDENT" &&
              "You can view events and RSVP to attend. Contact staff to propose events."}
          </p>
        </div>

        {/* Calendar Component */}
        <EventCalendar />
      </main>
    </div>
  );
}
