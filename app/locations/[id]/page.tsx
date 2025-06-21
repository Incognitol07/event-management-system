"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { format } from "date-fns";
import ProtectedHeader from "@/components/layout/protected-header";

type Venue = {
  id: number;
  name: string;
  capacity: number;
  events: Array<{
    id: number;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    isApproved: boolean;
    createdBy: { name: string };
    _count: { rsvps: number };
  }>;
  _count: { events: number };
};

export default function VenueDetailPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const venueId = params.id as string;

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    capacity: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && venueId) {
      fetchVenue();
    }
  }, [user, venueId]);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/venues/${venueId}`);
      if (response.ok) {
        const data = await response.json();
        setVenue(data);
        setEditForm({
          name: data.name,
          capacity: data.capacity,
        });
      } else if (response.status === 404) {
        router.push("/locations");
      }
    } catch (error) {
      console.error("Failed to fetch venue:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!venue || !user || user.role !== "ADMIN") return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/venues/${venueId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedVenue = await response.json();
        setVenue(updatedVenue);
        setEditing(false);
      }
    } catch (error) {
      console.error("Failed to update venue:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!venue || !user || user.role !== "ADMIN") return;

    if (
      !confirm(
        `Are you sure you want to delete "${venue.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/venues/${venueId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/locations");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete venue");
      }
    } catch (error) {
      console.error("Failed to delete venue:", error);
      alert("Failed to delete venue");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-4xl font-light text-gray-400">...</div>
      </div>
    );
  }

  if (!user || !venue) {
    return null;
  }

  const canEdit = user.role === "ADMIN";
  const upcomingEvents =
    venue.events?.filter(
      (event) => new Date(event.date) >= new Date() && event.isApproved
    ) || [];
  const pastEvents =
    venue.events?.filter(
      (event) => new Date(event.date) < new Date() && event.isApproved
    ) || [];

  return (
    <div className="min-h-screen bg-white">
      <ProtectedHeader currentPage="venues" />

      <main className="max-w-4xl mx-auto px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900 mb-6 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to Venues</span>
        </button>

        {/* Venue header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-2xl font-light"
                      placeholder="Venue name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={editForm.capacity}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          capacity: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="Maximum capacity"
                      min="1"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-light text-gray-900 mb-2">
                    {venue.name}
                  </h1>
                  <p className="text-gray-600">
                    Capacity: {venue.capacity} people
                  </p>
                </div>
              )}
            </div>

            {canEdit && (
              <div className="flex space-x-3">
                {editing ? (
                  <>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEditForm({
                          name: venue.name,
                          capacity: venue.capacity,
                        });
                      }}
                      disabled={submitting}
                      className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:border-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={
                        submitting || !editForm.name || editForm.capacity < 1
                      }
                      className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Saving..." : "Save"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:border-gray-400 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={submitting || venue._count.events > 0}
                      className="text-sm text-red-600 hover:text-red-700 px-4 py-2 border border-red-300 hover:border-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        venue._count.events > 0
                          ? "Cannot delete venue with existing events"
                          : "Delete venue"
                      }
                    >
                      {submitting ? "Deleting..." : "Delete"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Venue stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="border border-gray-200 p-6 text-center">
              <div className="text-2xl font-light text-gray-900">
                {venue._count.events}
              </div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="border border-gray-200 p-6 text-center">
              <div className="text-2xl font-light text-gray-900">
                {upcomingEvents.length}
              </div>
              <div className="text-sm text-gray-600">Upcoming Events</div>
            </div>
            <div className="border border-gray-200 p-6 text-center">
              <div className="text-2xl font-light text-gray-900">
                {venue.capacity}
              </div>
              <div className="text-sm text-gray-600">Max Capacity</div>
            </div>
          </div>

          {/* Upcoming events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Upcoming Events
              </h2>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(event.date), "MMM d, yyyy")} •{" "}
                          {event.startTime} – {event.endTime}
                        </p>
                        <p className="text-sm text-gray-600">
                          Organized by {event.createdBy.name}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {event._count.rsvps} registered
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Past Events
              </h2>
              <div className="space-y-3">
                {pastEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer opacity-75"
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(event.date), "MMM d, yyyy")} •{" "}
                          {event.startTime} – {event.endTime}
                        </p>
                        <p className="text-sm text-gray-600">
                          Organized by {event.createdBy.name}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {event._count.rsvps} attended
                      </div>
                    </div>
                  </div>
                ))}
                {pastEvents.length > 5 && (
                  <p className="text-sm text-gray-600 text-center py-2">
                    ... and {pastEvents.length - 5} more past events
                  </p>
                )}
              </div>
            </div>
          )}

          {venue._count.events === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 opacity-60">🏛️</div>
              <p className="text-gray-600">
                No events have been hosted at this venue yet
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
