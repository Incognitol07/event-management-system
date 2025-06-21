"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { format } from "date-fns";
import ProtectedHeader from "@/components/layout/protected-header";
import { ResourceSelector } from "@/components/resources/resource-selector";
import { ResourceView } from "@/components/resources/resource-view";
import OrganizerManagement from "@/components/events/organizer-management";

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: { id: number; name: string; capacity: number };
  capacity: number;
  memo: string;
  priority: string;
  isApproved: boolean;
  createdBy: { name: string; role: string };
  organizers?: Array<{
    id: number;
    userId: number;
    role: "PRIMARY_ORGANIZER" | "CO_ORGANIZER";
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  }>;
  rsvps: Array<{
    id: number;
    status: string;
    user: { name: string };
  }>;
  _count: { rsvps: number };
};

type RSVPData = {
  id?: number;
  status: string;
};

type Feedback = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: number; name: string };
};

type ResourceAllocation = {
  id: number;
  resourceId: number;
  quantityNeeded: number;
  status: string;
  notes?: string;
  resource: {
    id: number;
    name: string;
    description?: string;
    category: string;
    totalCount: number;
    availableCount: number;
    allocatedCount: number;
    isActive: boolean;
  };
};

export default function EventDetailPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRSVP, setUserRSVP] = useState<RSVPData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [resourceAllocations, setResourceAllocations] = useState<
    ResourceAllocation[]
  >([]);

  useEffect(() => {
    if (user && eventId) {
      fetchEvent();
    }
  }, [user, eventId]);
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);

        // Find user's RSVP if exists
        const existingRSVP = data.rsvps?.find(
          (rsvp: any) => rsvp.userId === user?.id
        );
        if (existingRSVP) {
          setUserRSVP(existingRSVP);
        } // Fetch resource allocations
        fetchResourceAllocations();
      } else if (response.status === 404) {
        router.push("/events");
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleRSVP = async (status: "ACCEPTED" | "DECLINED") => {
    if (!user || !event) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, userId: user.id }),
      });

      if (response.ok) {
        const updatedRSVP = await response.json();
        setUserRSVP(updatedRSVP);
        // Refresh event data to get updated counts
        fetchEvent();
      }
    } catch (error) {
      console.error("Failed to update RSVP:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchFeedback = async () => {
    if (!eventId) return;

    setLoadingFeedback(true);
    try {
      const response = await fetch(`/api/events/${eventId}/feedback`);
      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const fetchResourceAllocations = async () => {
    if (!eventId) return;

    try {
      const response = await fetch(`/api/events/${eventId}/resources`);
      if (response.ok) {
        const data = await response.json();
        setResourceAllocations(data);
      }
    } catch (error) {
      console.error("Failed to fetch resource allocations:", error);
    }
  };

  useEffect(() => {
    fetchFeedback();
    fetchResourceAllocations();
  }, [eventId]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-4xl font-light text-gray-400">...</div>
      </div>
    );
  }

  if (!user || !event) {
    return null;
  }

  const canApprove = user.role === "ADMIN" && !event.isApproved;
  const canRSVP = event.isApproved && user.role === "STUDENT";
  const isEventFull = event._count.rsvps >= event.capacity;
  const acceptedRSVPs =
    event.rsvps?.filter((rsvp) => rsvp.status === "ACCEPTED") || [];

  return (
    <div className="min-h-screen bg-white">
      <ProtectedHeader currentPage="events" />{" "}
      <main className="max-w-5xl mx-auto px-4 py-4">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to Events</span>
        </button>

        {/* Event header */}
        <div className="mb-6">
          {" "}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl font-light text-gray-900">
                  {event.title}
                </h1>
                {event.priority === "EMERGENCY" && (
                  <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded">
                    Emergency
                  </span>
                )}
                {!event.isApproved && (
                  <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded">
                    Pending Approval
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                Organized by {event.createdBy.name}
              </p>
            </div>

            {canApprove && (
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `/api/events/${eventId}/approve`,
                      {
                        method: "PATCH",
                      }
                    );
                    if (response.ok) {
                      fetchEvent();
                    }
                  } catch (error) {
                    console.error("Failed to approve event:", error);
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Approve Event
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {" "}
            {/* Description */}{" "}
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
            {/* Memo (if exists) */}
            {event.memo && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Additional Information
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.memo}
                </p>
              </div>
            )}
            {/* Attendees (if user can see them) */}
            {(user.role === "ADMIN" || user.role === "ORGANIZER") &&
              acceptedRSVPs.length > 0 && (
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-2">
                    Confirmed Attendees ({acceptedRSVPs.length})
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {" "}
                    {acceptedRSVPs.map((rsvp) => (
                      <div key={rsvp.id} className="text-sm text-gray-700">
                        {rsvp.user.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}{" "}
            {/* Resource Management */}
            {user.role === "ADMIN" && (
              <div>
                <ResourceSelector
                  eventId={parseInt(eventId)}
                  eventDate={event.date}
                  onResourceAllocated={fetchResourceAllocations}
                  existingAllocations={resourceAllocations}
                />
              </div>
            )}{" "}
            {/* Resource View for organizers and staff */}
            {user.role !== "ADMIN" && (
              <ResourceView
                eventId={parseInt(eventId)}
                isOrganizer={
                  event.createdBy.name === user.name ||
                  event.organizers?.some((org) => org.userId === user?.id) ||
                  false
                }
              />
            )}
          </div>{" "}
          {/* Sidebar */}
          <div className="space-y-3">
            {/* Event details card */}
            <div className="border border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Event Details
              </h3>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-600">Date & Time</div>
                  <div className="font-medium text-gray-900">
                    {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="text-sm text-gray-700">
                    {event.startTime} – {event.endTime}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Venue</div>
                  <div className="font-medium text-gray-900">
                    {event.venue.name}
                  </div>
                  <div className="text-sm text-gray-700">
                    Capacity: {event.venue.capacity} people
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Event Capacity</div>
                  <div className="font-medium text-gray-900">
                    {event._count.rsvps} / {event.capacity} registered
                  </div>
                  {isEventFull && (
                    <div className="text-sm text-red-600 mt-1">
                      Event is full
                    </div>
                  )}
                </div>{" "}
              </div>
            </div>
            {/* Organizer Management - Show for organizers and admins */}
            {(user?.role === "ADMIN" ||
              event.organizers?.some((org) => org.userId === user?.id) ||
              event.createdBy.name === user?.name) && (
              <div className="border border-gray-200 p-4">
                <OrganizerManagement
                  eventId={event.id}
                  currentUserId={user?.id || 0}
                  onOrganizerAdded={fetchEvent}
                  onOrganizerRemoved={fetchEvent}
                />
              </div>
            )}
            {/* RSVP card */}{" "}
            {canRSVP && (
              <div className="border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Registration
                </h3>{" "}
                {userRSVP ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Your status:
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          userRSVP.status === "ACCEPTED"
                            ? "bg-green-100 text-green-700"
                            : userRSVP.status === "DECLINED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {userRSVP.status.toLowerCase()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleRSVP("ACCEPTED")}
                        disabled={
                          submitting ||
                          (isEventFull && userRSVP.status !== "ACCEPTED")
                        }
                        className={`w-full text-sm py-2 px-4 transition-colors ${
                          userRSVP.status === "ACCEPTED"
                            ? "bg-green-600 text-white"
                            : "border border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        } ${
                          isEventFull && userRSVP.status !== "ACCEPTED"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {submitting ? "..." : "Accept"}
                      </button>

                      <button
                        onClick={() => handleRSVP("DECLINED")}
                        disabled={submitting}
                        className={`w-full text-sm py-2 px-4 transition-colors ${
                          userRSVP.status === "DECLINED"
                            ? "bg-red-600 text-white"
                            : "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        }`}
                      >
                        {submitting ? "..." : "Decline"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleRSVP("ACCEPTED")}
                      disabled={submitting || isEventFull}
                      className={`w-full text-sm py-2 px-4 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors ${
                        isEventFull ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {submitting
                        ? "..."
                        : isEventFull
                        ? "Event Full"
                        : "Register"}
                    </button>

                    <button
                      onClick={() => handleRSVP("DECLINED")}
                      disabled={submitting}
                      className="w-full text-sm py-2 px-4 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                    >
                      {submitting ? "..." : "Not Interested"}
                    </button>
                  </div>
                )}
              </div>
            )}{" "}
            {/* Feedback section */}
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Feedback
              </h2>

              {loadingFeedback ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ) : feedback.length > 0 ? (
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="border border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.user.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {format(new Date(item.createdAt), "MMMM d, yyyy")}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          Rating: {item.rating}/5
                        </div>
                      </div>
                      {item.comment && (
                        <div className="text-gray-700 leading-relaxed">
                          {item.comment}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-600">No feedback yet.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
