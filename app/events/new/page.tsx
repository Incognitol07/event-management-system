"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ProtectedHeader from "@/components/layout/protected-header";
import DateTimePicker from "@/components/ui/datetime-picker";

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

    // Validate required fields
    if (!formData.title.trim()) {
      setError("Event title is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      setError("Event description is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.date) {
      setError("Event date is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.startTime) {
      setError("Start time is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.endTime) {
      setError("End time is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.venueId) {
      setError("Venue selection is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.capacity || parseInt(formData.capacity) < 1) {
      setError("Valid expected attendees count is required");
      setIsSubmitting(false);
      return;
    }

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

  const handleDateTimeChange = (
    field: "date" | "startTime" | "endTime",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      <ProtectedHeader currentPage="events" />

      <main className="max-w-4xl mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-105"
              placeholder="Enter a clear, descriptive title"
            />
          </div>
          {/* Description */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 resize-none hover:border-gray-400 focus:scale-105"
              placeholder="Describe your event in detail..."
            />
            <div
              className={`text-sm mt-1 transition-all duration-300 ${
                wordCount > 300
                  ? "text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {wordCount} / 300 words
              {wordCount > 250 && wordCount <= 300 && (
                <span className="ml-1 opacity-60">almost there! ✍️</span>
              )}
            </div>
          </div>{" "}
          {/* Date and Time */}
          <DateTimePicker
            date={formData.date}
            startTime={formData.startTime}
            endTime={formData.endTime}
            onChange={handleDateTimeChange}
          />
          {/* Venue and Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
                Venue
              </label>
              <select
                name="venueId"
                required
                value={formData.venueId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-105"
              >
                <option value="">Select a venue</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} (Capacity: {venue.capacity})
                  </option>
                ))}
              </select>
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
                Expected Attendees
              </label>
              <input
                type="number"
                name="capacity"
                required
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-105"
                placeholder="Number of attendees"
              />
            </div>
          </div>
          {/* Priority */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-105"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              {user?.role === "ADMIN" && (
                <option value="EMERGENCY">Emergency</option>
              )}
            </select>
          </div>
          {/* Memo */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
              Approval Memo
            </label>
            <textarea
              name="memo"
              required
              rows={3}
              value={formData.memo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 resize-none hover:border-gray-400 focus:scale-105"
              placeholder="Provide justification for this event..."
            />
          </div>
          {error && (
            <div className="text-center py-2">
              <p className="text-sm text-red-600 animate-pulse">{error}</p>
            </div>
          )}
          <div className="flex justify-between items-center pt-6">
            <div className="text-sm text-gray-600">
              Almost ready!
              <span className="inline-block ml-1 transition-transform duration-300 hover:rotate-12">
                🚀
              </span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 hover:scale-105 hover:shadow-lg group"
            >
              <span className="transition-all duration-300 group-hover:tracking-wider">
                {isSubmitting ? "Creating..." : "Create Event"}
              </span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
