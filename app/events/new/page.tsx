"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

type Venue = {
  id: number;
  name: string;
  capacity: number;
};

export default function NewEventPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    venueId: "",
    capacity: "",
    memo: "",
    priority: "NORMAL" as "LOW" | "NORMAL" | "HIGH" | "EMERGENCY",
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch("/api/venues");
      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      }
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate word count (300 words max)
    const wordCount = formData.description.trim().split(/\s+/).length;
    if (wordCount > 300) {
      setError("Description cannot exceed 300 words");
      setIsSubmitting(false);
      return;
    }

    // Validate time
    if (formData.startTime >= formData.endTime) {
      setError("End time must be after start time");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          venueId: parseInt(formData.venueId),
          capacity: parseInt(formData.capacity),
          createdById: user?.id,
          isApproved: user?.role === "ADMIN", // Auto-approve for admins
        }),
      });

      if (response.ok) {
        router.push("/events");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create event");
      }
    } catch (error) {
      setError("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const wordCount = formData.description
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return (
    <div className="min-h-screen bg-white">
      {/* Compact header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-medium text-gray-900">Create Event</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
              placeholder="Enter a clear, descriptive title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors resize-none"
              placeholder="Describe your event in detail..."
            />
            <div
              className={`text-sm mt-1 ${
                wordCount > 300 ? "text-red-600" : "text-gray-500"
              }`}
            >
              {wordCount} / 300 words
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Venue and Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Venue
              </label>
              <select
                name="venueId"
                required
                value={formData.venueId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
              >
                <option value="">Select a venue</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} (Capacity: {venue.capacity})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Expected Attendees
              </label>
              <input
                type="number"
                name="capacity"
                required
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
                placeholder="Number of attendees"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              {user.role === "ADMIN" && (
                <option value="EMERGENCY">Emergency</option>
              )}
            </select>
          </div>

          {/* Memo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Approval Memo
            </label>
            <textarea
              name="memo"
              required
              rows={3}
              value={formData.memo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors resize-none"
              placeholder="Provide justification for this event..."
            />
          </div>

          {error && (
            <div className="text-center py-2">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
