"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { format } from "date-fns";
import ProtectedHeader from "@/components/layout/protected-header";

type EventRSVP = {
  id: number;
  status: string;
  rsvpAt: string;
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: { name: string };
    createdBy: { name: string };
  };
  feedback?: {
    id: number;
    rating: number;
    comment: string;
  } | null;
};

type FeedbackForm = {
  rating: number;
  comment: string;
};

export default function MyEventsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [rsvps, setRSVPs] = useState<EventRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [feedbackForm, setFeedbackForm] = useState<
    Record<number, FeedbackForm>
  >({});
  const [submittingFeedback, setSubmittingFeedback] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user?.id}/events`);
      if (response.ok) {
        const data = await response.json();
        setRSVPs(data);
      }
    } catch (error) {
      console.error("Failed to fetch user events:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (eventId: number) => {
    if (!feedbackForm[eventId] || feedbackForm[eventId].rating === 0) return;

    try {
      setSubmittingFeedback((prev) => ({ ...prev, [eventId]: true }));
      const response = await fetch(`/api/events/${eventId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          rating: feedbackForm[eventId].rating,
          comment: feedbackForm[eventId].comment.trim() || null,
        }),
      });

      if (response.ok) {
        // Refresh the events to show the submitted feedback
        fetchMyEvents();
        // Clear the form
        setFeedbackForm((prev) => ({
          ...prev,
          [eventId]: { rating: 0, comment: "" },
        }));
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setSubmittingFeedback((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const initializeFeedbackForm = (eventId: number) => {
    if (!feedbackForm[eventId]) {
      setFeedbackForm((prev) => ({
        ...prev,
        [eventId]: { rating: 0, comment: "" },
      }));
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

  const now = new Date();
  const filteredRSVPs = rsvps.filter((rsvp) => {
    const eventDate = new Date(rsvp.event.date);
    if (filter === "upcoming")
      return eventDate >= now && rsvp.status === "ACCEPTED";
    if (filter === "past") return eventDate < now && rsvp.status === "ACCEPTED";
    return rsvp.status === "ACCEPTED";
  });

  return (
    <div className="min-h-screen bg-white">
      <ProtectedHeader currentPage="profile" />

      <main className="max-w-4xl mx-auto px-6 py-6">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-900">My Events</h1>
          <p className="text-sm text-gray-600 mt-1">
            Events you've registered for and attended
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => setFilter("upcoming")}
            className={`text-sm px-3 py-2 transition-all duration-300 ${
              filter === "upcoming"
                ? "border-b-2 border-gray-900 font-medium text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`text-sm px-3 py-2 transition-all duration-300 ${
              filter === "past"
                ? "border-b-2 border-gray-900 font-medium text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Past Events
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

        {filteredRSVPs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 opacity-60">📅</div>
            <p className="text-lg text-gray-600">
              {filter === "upcoming"
                ? "No upcoming events"
                : filter === "past"
                ? "No past events"
                : "No registered events"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {filter === "upcoming" && "Register for events to see them here"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRSVPs.map((rsvp) => {
              const eventDate = new Date(rsvp.event.date);
              const isPastEvent = eventDate < now;
              const hasFeedback = rsvp.feedback !== null;

              return (
                <div key={rsvp.id} className="border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3
                          className="text-lg font-medium text-gray-900 cursor-pointer hover:text-gray-700"
                          onClick={() =>
                            router.push(`/events/${rsvp.event.id}`)
                          }
                        >
                          {rsvp.event.title}
                        </h3>
                        {isPastEvent && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {rsvp.event.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {format(eventDate, "MMM d, yyyy")}
                      </div>
                      <div>
                        {rsvp.event.startTime} – {rsvp.event.endTime}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {rsvp.event.venue.name}
                      </div>
                      <div>by {rsvp.event.createdBy.name}</div>
                    </div>
                  </div>

                  {/* Feedback section for past events */}
                  {isPastEvent && (
                    <div className="border-t border-gray-100 pt-4">
                      {hasFeedback ? (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Your Feedback
                          </h4>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm text-gray-600">
                              Rating:
                            </span>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-sm ${
                                    star <= (rsvp.feedback?.rating || 0)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              ({rsvp.feedback?.rating}/5)
                            </span>
                          </div>
                          {rsvp.feedback?.comment && (
                            <p className="text-sm text-gray-700 italic">
                              "{rsvp.feedback.comment}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Share Your Feedback
                          </h4>
                          <div className="space-y-3">
                            {/* Star rating */}
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">
                                Rating *
                              </label>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => {
                                      initializeFeedbackForm(rsvp.event.id);
                                      setFeedbackForm((prev) => ({
                                        ...prev,
                                        [rsvp.event.id]: {
                                          ...prev[rsvp.event.id],
                                          rating: star,
                                        },
                                      }));
                                    }}
                                    className={`text-lg transition-colors ${
                                      star <=
                                      (feedbackForm[rsvp.event.id]?.rating || 0)
                                        ? "text-yellow-400 hover:text-yellow-500"
                                        : "text-gray-300 hover:text-gray-400"
                                    }`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Comment */}
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">
                                Comment (optional)
                              </label>
                              <textarea
                                value={
                                  feedbackForm[rsvp.event.id]?.comment || ""
                                }
                                onChange={(e) => {
                                  initializeFeedbackForm(rsvp.event.id);
                                  setFeedbackForm((prev) => ({
                                    ...prev,
                                    [rsvp.event.id]: {
                                      ...prev[rsvp.event.id],
                                      comment: e.target.value,
                                    },
                                  }));
                                }}
                                className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
                                rows={3}
                                placeholder="Share your thoughts about this event..."
                              />
                            </div>

                            {/* Submit button */}
                            <button
                              onClick={() => submitFeedback(rsvp.event.id)}
                              disabled={
                                !feedbackForm[rsvp.event.id]?.rating ||
                                submittingFeedback[rsvp.event.id]
                              }
                              className="text-sm bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submittingFeedback[rsvp.event.id]
                                ? "Submitting..."
                                : "Submit Feedback"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
