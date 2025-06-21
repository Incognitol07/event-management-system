"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { format } from "date-fns";
import ProtectedHeader from "@/components/layout/protected-header";

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: { name: string; capacity: number };
  capacity: number;
  priority: string;
  isApproved: boolean;
  createdBy: { name: string; role: string };
};

export default function EventsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">(
    "approved"
  );

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveEvent = async (eventId: number) => {
    try {
      const response = await fetch(`/api/events/${eventId}/approve`, {
        method: "POST",
      });
      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to approve event:", error);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-4xl font-light text-gray-400">...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredEvents = events.filter((event) => {
    if (filter === "approved") return event.isApproved;
    if (filter === "pending") return !event.isApproved;
    return true;
  });

  const canApprove = user.role === "ADMIN";
  const canCreate = user.role === "ADMIN" || user.role === "STAFF";
  return (
    <div className="min-h-screen bg-white">
      <ProtectedHeader currentPage="events" />

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Page header with title and actions */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-light text-gray-900">Events</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and view all events
              </p>
            </div>
            {canCreate && (
              <button
                onClick={() => router.push("/events/new")}
                className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                New Event
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setFilter("approved")}
              className={`text-sm px-3 py-2 transition-all duration-300 ${
                filter === "approved"
                  ? "border-b-2 border-gray-900 font-medium text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`text-sm px-3 py-2 transition-all duration-300 ${
                filter === "pending"
                  ? "border-b-2 border-gray-900 font-medium text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`text-sm px-3 py-2 transition-all duration-300 ${
                filter === "all"
                  ? "border-b-2 border-gray-900 font-medium text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All
            </button>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No events found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {event.title}
                      </h3>
                      {event.priority === "EMERGENCY" && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          Emergency
                        </span>
                      )}
                      {!event.isApproved && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                  {canApprove && !event.isApproved && (
                    <button
                      onClick={() => approveEvent(event.id)}
                      className="ml-4 text-sm bg-green-600 text-white px-3 py-1 hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <div className="font-medium text-gray-900">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </div>
                    <div>
                      {event.startTime} – {event.endTime}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {event.venue.name}
                    </div>
                    <div>Cap: {event.capacity}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {event.createdBy.name}
                    </div>
                    <div>{event.createdBy.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
