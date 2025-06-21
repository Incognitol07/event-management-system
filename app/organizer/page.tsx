"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { format } from "date-fns";
import ProtectedHeader from "@/components/layout/protected-header";
import ConfirmModal from "@/components/ui/confirm-modal";

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
  createdBy: { name: string; role: string; id: number };
  rsvps?: Array<{ status: string }>;
  feedback?: Array<{ rating: number; comment: string; user: { name: string } }>;
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

type Analytics = {
  totalEvents: number;
  approvedEvents: number;
  pendingEvents: number;
  totalAttendees: number;
  averageRating: number;
  feedbackCount: number;
};

export default function OrganizerDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "feedback"
  >("overview");
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    eventId: number | null;
  }>({
    isOpen: false,
    eventId: null,
  });

  useEffect(() => {
    if (user) {
      fetchOrganizerData();
    }
  }, [user]);
  const fetchOrganizerData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user?.id}/organizer`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        calculateAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch organizer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (eventsData: Event[]) => {
    const approved = eventsData.filter((e) => e.isApproved).length;
    const pending = eventsData.filter((e) => !e.isApproved).length;
    const totalAttendees = eventsData.reduce(
      (sum, event) =>
        sum +
        (event.rsvps?.filter((rsvp) => rsvp.status === "ACCEPTED").length || 0),
      0
    );

    const allFeedback = eventsData.flatMap((e) => e.feedback || []);
    const averageRating =
      allFeedback.length > 0
        ? allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length
        : 0;

    setAnalytics({
      totalEvents: eventsData.length,
      approvedEvents: approved,
      pendingEvents: pending,
      totalAttendees,
      averageRating,
      feedbackCount: allFeedback.length,
    });
  };

  const cancelEvent = async (eventId: number) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchOrganizerData();
        setCancelModal({ isOpen: false, eventId: null });
      }
    } catch (error) {
      console.error("Failed to cancel event:", error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      ACADEMIC: "bg-blue-100 text-blue-700 border-blue-200",
      SPIRITUAL: "bg-purple-100 text-purple-700 border-purple-200",
      SOCIAL: "bg-green-100 text-green-700 border-green-200",
      STUDENT_ORG: "bg-yellow-100 text-yellow-700 border-yellow-200",
      SPORTS: "bg-orange-100 text-orange-700 border-orange-200",
      CULTURAL: "bg-pink-100 text-pink-700 border-pink-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const getStatusColor = (isApproved: boolean) => {
    return isApproved
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";
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

  // Show message if user has no events
  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <ProtectedHeader currentPage="organizer" />
        <main className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center py-16">
            <h1 className="text-2xl font-light text-gray-900 mb-4">
              Your Event Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
              You haven't created any events yet.
            </p>
            <button
              onClick={() => router.push("/events/new")}
              className="bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Create Your First Event
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ProtectedHeader currentPage="organizer" />
      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-900">
            Your Event Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your events, view analytics, and track feedback
          </p>
        </div>

        {/* Tab navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "events", label: "My Events" },
              { id: "feedback", label: "Feedback" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 text-sm transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id
                    ? "font-medium text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && analytics && (
          <div className="space-y-6">
            {/* Analytics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Events Created
                </h3>
                <div className="text-3xl font-light text-gray-900 mb-1">
                  {analytics.totalEvents}
                </div>
                <div className="text-sm text-gray-600">
                  {analytics.approvedEvents} approved •{" "}
                  {analytics.pendingEvents} pending
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Total Attendees
                </h3>
                <div className="text-3xl font-light text-gray-900 mb-1">
                  {analytics.totalAttendees}
                </div>
                <div className="text-sm text-gray-600">
                  Across all approved events
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Average Rating
                </h3>
                <div className="text-3xl font-light text-gray-900 mb-1">
                  {analytics.averageRating > 0
                    ? analytics.averageRating.toFixed(1)
                    : "—"}
                </div>
                <div className="text-sm text-gray-600">
                  {analytics.feedbackCount} reviews received
                </div>
              </div>
            </div>

            {/* Recent events */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Events
              </h3>
              <div className="space-y-3">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors rounded px-2"
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 hover:text-gray-700 transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(event.date), "MMM d, yyyy")} •{" "}
                        {event.venue.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium border rounded ${getStatusColor(
                          event.isApproved
                        )}`}
                      >
                        {event.isApproved ? "Approved" : "Pending"}
                      </span>{" "}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/events/${event.id}`);
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        View →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:shadow-sm cursor-pointer"
                onClick={() => router.push(`/events/${event.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      {" "}
                      <h3
                        className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/events/${event.id}`);
                        }}
                      >
                        {event.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium border rounded ${getStatusColor(
                            event.isApproved
                          )}`}
                        >
                          {event.isApproved ? "Approved" : "Pending"}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium border rounded ${getCategoryColor(
                            event.category
                          )}`}
                        >
                          {event.category.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Date:</span>
                        <br />
                        {format(new Date(event.date), "MMM d, yyyy")}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span>
                        <br />
                        {event.startTime} - {event.endTime}
                      </div>
                      <div>
                        <span className="font-medium">Venue:</span>
                        <br />
                        {event.venue.name}
                      </div>
                      <div>
                        <span className="font-medium">Capacity:</span>
                        <br />
                        {event.capacity} people
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>
                      {event.rsvps?.filter((r) => r.status === "ACCEPTED")
                        .length || 0}{" "}
                      attendees
                    </span>
                    <span>{event.feedback?.length || 0} reviews</span>
                  </div>{" "}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/events/${event.id}`);
                      }}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      View Details
                    </button>
                    {!event.isApproved && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCancelModal({ isOpen: true, eventId: event.id });
                        }}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div className="space-y-6">
            {events
              .filter((e) => e.feedback && e.feedback.length > 0)
              .map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {event.title}
                  </h3>
                  <div className="space-y-4">
                    {event.feedback?.map((feedback, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {feedback.user.name}
                          </span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < feedback.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        {feedback.comment && (
                          <p className="text-gray-600 text-sm">
                            {feedback.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            {events.filter((e) => e.feedback && e.feedback.length > 0)
              .length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No feedback received yet</p>
              </div>
            )}
          </div>
        )}
      </main>
      {/* Cancel confirmation modal */}{" "}
      <ConfirmModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, eventId: null })}
        onConfirm={() =>
          cancelModal.eventId && cancelEvent(cancelModal.eventId)
        }
        title="Cancel Event Request"
        message="Are you sure you want to cancel this event request? This action cannot be undone."
        confirmText="Cancel Event"
        confirmVariant="danger"
      />
    </div>
  );
}
