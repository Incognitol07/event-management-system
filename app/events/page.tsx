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
  category: string;
  department?: string;
  isApproved: boolean;
  createdBy: { name: string; role: string };
  resources?: Array<{
    id: number;
    resourceId: number;
    quantityNeeded: number;
    status: string;
    resource: {
      name: string;
      category: string;
    };
  }>;
};

export default function EventsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">(
    "approved" // Default to approved for all users
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Check if user can see pending events
  const canViewPendingEvents = user?.role === "ADMIN";

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
        method: "PATCH",
      });
      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to approve event:", error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      ACADEMIC: "bg-blue-100 text-blue-700",
      SPIRITUAL: "bg-purple-100 text-purple-700",
      SOCIAL: "bg-green-100 text-green-700",
      STUDENT_ORG: "bg-yellow-100 text-yellow-700",
      SPORTS: "bg-orange-100 text-orange-700",
      CULTURAL: "bg-pink-100 text-pink-700",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      ACADEMIC: "Academic",
      SPIRITUAL: "Spiritual",
      SOCIAL: "Social",
      STUDENT_ORG: "Student Org",
      SPORTS: "Sports",
      CULTURAL: "Cultural",
    };
    return labels[category as keyof typeof labels] || category;
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
    // Filter by approval status
    let statusMatch = true;
    if (filter === "approved") statusMatch = event.isApproved;
    if (filter === "pending") statusMatch = !event.isApproved;

    // Filter by category
    let categoryMatch = true;
    if (categoryFilter !== "all")
      categoryMatch = event.category === categoryFilter;

    return statusMatch && categoryMatch;
  });

  const canApprove = user.role === "ADMIN";
  const canCreate = user.role === "ADMIN" || user.role === "ORGANIZER";
  return (
  <div className="min-h-screen bg-white">
    <ProtectedHeader currentPage="events" />

    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Page header with title and actions */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-light text-gray-900">
              Events
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and view all events
            </p>
          </div>
          {canCreate && (
            <button
              onClick={() => router.push("/events/new")}
              className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg group w-full sm:w-auto touch-manipulation active:scale-95"
            >
              <span className="transition-all duration-300 group-hover:tracking-wider">
                Create Event
              </span>
            </button>
          )}{" "}
        </div>
        {/* Filter tabs */}{" "}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto">
            <button
              onClick={() => setFilter("approved")}
              className={`text-sm px-3 py-2 transition-all duration-300 whitespace-nowrap ${
                filter === "approved"
                  ? "border-b-2 border-gray-900 font-medium text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Approved
            </button>
            {canViewPendingEvents && (
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
            )}
            {canViewPendingEvents && (
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
            )}
          </div>{" "}
          {/* Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Category:
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm border border-gray-200 px-3 py-2 focus:border-gray-900 focus:outline-none transition-all duration-300 w-full sm:w-auto"
            >
              <option value="all">All Categories</option>
              <option value="ACADEMIC">Academic</option>
              <option value="SPIRITUAL">Spiritual</option>
              <option value="SOCIAL">Social</option>
              <option value="STUDENT_ORG">Student Organization</option>
              <option value="SPORTS">Sports</option>
              <option value="CULTURAL">Cultural</option>
            </select>
          </div>
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
              className="border border-gray-200 p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getCategoryColor(
                          event.category
                        )}`}
                      >
                        {getCategoryLabel(event.category)}
                      </span>
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
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3 sm:line-clamp-2">
                    {event.description}
                  </p>
                  {/* Show resource requests for pending events (admin only) */}
                  {!event.isApproved &&
                    canApprove &&
                    event.resources &&
                    event.resources.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Resource Requests:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {event.resources.slice(0, 3).map((resource, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
                            >
                              {resource.resource.name} (
                              {resource.quantityNeeded})
                            </span>
                          ))}
                          {event.resources.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{event.resources.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}{" "}
                </div>
                {canApprove && !event.isApproved && (
                  <div className="mt-3 sm:mt-0 sm:ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        approveEvent(event.id);
                      }}
                      className="text-sm bg-green-600 text-white px-3 py-2 hover:bg-green-700 transition-colors w-full sm:w-auto touch-manipulation active:scale-95"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-gray-600">
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
                {event.department && (
                  <div>
                    <div className="font-medium text-gray-900">Department</div>
                    <div>{event.department}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  </div>
  );
}

