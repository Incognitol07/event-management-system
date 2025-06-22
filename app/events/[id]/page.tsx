"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { format } from "date-fns";
import ProtectedHeader from "@/components/layout/protected-header";
import { ResourceAllocationModal } from "@/components/resources/resource-allocation-modal";
import { ResourceView } from "@/components/resources/resource-view";
import OrganizerManagement from "@/components/events/organizer-management";
import TicketSection from "@/components/events/ticket-section";
import ConfirmModal from "@/components/ui/confirm-modal";
import { getRecurrenceDescription } from "@/lib/recurring-events";

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
  isRecurring?: boolean;
  recurrenceType?: "DAILY" | "WEEKLY" | "MONTHLY";
  recurrenceEnd?: string;
  parentEventId?: number;
  originalDate?: string;
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
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    eventId: number | null;
  }>({
    isOpen: false,
    eventId: null,
  });

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

  const deleteEvent = async () => {
    if (!user || !event) return;

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user.id?.toString() || "",
        },
      });
      if (response.ok) {
        router.push("/organizer");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete event");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event");
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

  // Check if current user is an organizer for this event
  const isOrganizer =
    event.createdBy.name === user.name ||
    event.organizers?.some((org) => org.userId === user?.id) ||
    false;
  return (
    <div className="min-h-screen bg-white">
      <ProtectedHeader currentPage="events" />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center space-x-2 touch-manipulation"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        {/* Event header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-3 sm:space-y-0">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-light text-gray-900">
                  {event.title}
                </h1>
                <div className="flex flex-wrap gap-2">
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
              </p>{" "}
            </div>
            {canRSVP && user && (
              <TicketSection
                eventId={eventId}
                userId={user.id}
                userRSVP={userRSVP}
              />
            )}
            {/* Attendees (if user can see them) */}
            {(user.role === "ADMIN" || isOrganizer) &&
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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Event Resources
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage resources allocated to this event
                    </p>
                  </div>
                  <button
                    onClick={() => setShowResourceModal(true)}
                    className="group inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 bg-transparent transition-all duration-300 hover:border-gray-900 hover:shadow-sm rounded-lg"
                  >
                    <span className="transition-colors duration-300 group-hover:text-gray-900">
                      Add Resource
                    </span>
                  </button>
                </div>

                {/* Current Resource Allocations Summary */}
                {resourceAllocations.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Current Allocations ({resourceAllocations.length})
                    </h4>
                    <div className="space-y-2">
                      {resourceAllocations.slice(0, 3).map((allocation) => (
                        <div
                          key={allocation.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-700">
                            {allocation.resource.name} (
                            {allocation.quantityNeeded})
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              allocation.status === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : allocation.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {allocation.status == "APPROVED"
                              ? " "
                              : allocation.status}
                          </span>
                        </div>
                      ))}
                      {resourceAllocations.length > 3 && (
                        <div className="text-xs text-gray-500 pt-2">
                          +{resourceAllocations.length - 3} more resources...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {resourceAllocations.length === 0 && (
                  <div className="border border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-gray-500 text-sm">
                      No resources allocated to this event yet.
                    </div>
                    <button
                      onClick={() => setShowResourceModal(true)}
                      className="mt-2 text-sm text-gray-900 hover:underline"
                    >
                      Add your first resource
                    </button>
                  </div>
                )}
              </div>
            )}{" "}
            {/* Resource View for organizers only */}
            {isOrganizer && user.role !== "ADMIN" && (
              <ResourceView eventId={parseInt(eventId)} isOrganizer={true} />
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
                </div>{" "}
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
                {/* Recurrence information */}
                {event.isRecurring && (
                  <div>
                    <div className="text-sm text-gray-600">Recurring Event</div>
                    <div className="font-medium text-gray-900">
                      {getRecurrenceDescription(
                        event.recurrenceType || null,
                        event.recurrenceEnd
                          ? new Date(event.recurrenceEnd)
                          : null
                      )}
                    </div>
                  </div>
                )}
                {event.parentEventId && (
                  <div>
                    <div className="text-sm text-gray-600">Part of Series</div>
                    <div className="text-sm text-gray-700">
                      This is a recurring event instance
                    </div>
                  </div>
                )}{" "}
              </div>
            </div>{" "}
            {/* Organizer Management - Show for organizers and admins */}
            {(user?.role === "ADMIN" || isOrganizer) && (
              <div className="border border-gray-200 p-4">
                <OrganizerManagement
                  eventId={event.id}
                  currentUserId={user?.id || 0}
                  onOrganizerAdded={fetchEvent}
                  onOrganizerRemoved={fetchEvent}
                />
              </div>
            )}
            {/* Event Actions - Show for organizers and admins */}
            {(user?.role === "ADMIN" || isOrganizer) && (
              <div className="border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Event Actions
                </h3>
                <button
                  onClick={() =>
                    setDeleteModal({ isOpen: true, eventId: event.id })
                  }
                  className="w-full px-4 py-2 text-sm text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors rounded"
                >
                  Delete Event
                </button>
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
              )}{" "}
            </div>
          </div>
        </div>
      </main>{" "}
      {/* Resource Allocation Modal */}
      {user?.role === "ADMIN" && event && (
        <ResourceAllocationModal
          isOpen={showResourceModal}
          onClose={() => setShowResourceModal(false)}
          eventId={parseInt(eventId)}
          eventDate={event.date}
          onResourceAllocated={fetchResourceAllocations}
          existingAllocations={resourceAllocations}
        />
      )}
      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, eventId: null })}
        onConfirm={() => {
          if (deleteModal.eventId) {
            deleteEvent();
            setDeleteModal({ isOpen: false, eventId: null });
          }
        }}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone and will free up all associated resource allocations."
        confirmText="Delete Event"
        confirmVariant="danger"
      />
    </div>
  );
}
