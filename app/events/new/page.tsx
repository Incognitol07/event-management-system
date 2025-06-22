"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ProtectedHeader from "@/components/layout/protected-header";
import DateTimePicker from "@/components/ui/datetime-picker";
import DatePicker from "@/components/ui/date-picker";
import { EventResourceRequest } from "@/components/resources/event-resource-request";

interface ResourceRequest {
  resourceId: number;
  quantityNeeded: number;
  notes?: string;
}

type Venue = {
  id: number;
  name: string;
  capacity: number;
};

export default function NewEventPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [resourceRequests, setResourceRequests] = useState<ResourceRequest[]>(
    []
  );
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
    category: "ACADEMIC" as
      | "ACADEMIC"
      | "SPIRITUAL"
      | "SOCIAL"
      | "STUDENT_ORG"
      | "SPORTS"
      | "CULTURAL",
    department: "",
    isRecurring: false,
    recurrenceType: "WEEKLY" as "DAILY" | "WEEKLY" | "MONTHLY",
    recurrenceEnd: "",
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

  const addResourceRequest = (request: ResourceRequest) => {
    setResourceRequests((prev) => [...prev, request]);
  };

  const removeResourceRequest = (resourceId: number) => {
    setResourceRequests((prev) =>
      prev.filter((req) => req.resourceId !== resourceId)
    );
  };

  const updateResourceRequest = (
    resourceId: number,
    updates: Partial<ResourceRequest>
  ) => {
    setResourceRequests((prev) =>
      prev.map((req) =>
        req.resourceId === resourceId ? { ...req, ...updates } : req
      )
    );
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

    // Validate capacity against venue capacity
    const selectedVenue = venues.find(
      (v) => v.id.toString() === formData.venueId
    );
    if (selectedVenue && parseInt(formData.capacity) > selectedVenue.capacity) {
      setError(
        `Event capacity (${formData.capacity}) cannot exceed venue capacity (${selectedVenue.capacity})`
      );
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
      // Create the event first
      const eventResponse = await fetch("/api/events", {
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
          isRecurring: formData.isRecurring,
          recurrenceType: formData.isRecurring ? formData.recurrenceType : null,
          recurrenceEnd:
            formData.isRecurring && formData.recurrenceEnd
              ? formData.recurrenceEnd
              : null,
        }),
      });

      if (eventResponse.ok) {
        const newEvent = await eventResponse.json(); // If there are resource requests, create them
        if (resourceRequests.length > 0) {
          const resourcePromises = resourceRequests.map((request) =>
            fetch(`/api/events/${newEvent.id}/resources`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-user-id": user?.id?.toString() || "",
              },
              body: JSON.stringify(request),
            })
          );

          // Wait for all resource requests to be created
          await Promise.all(resourcePromises);
        }

        router.push("/organizer");
      } else {
        const errorData = await eventResponse.json();
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
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900 mb-6 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-900">
            Create New Event
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Fill out the details below to create your event
          </p>
        </div>
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
          {/* Recurring Event Settings */}
          <div className="group border border-gray-100 p-4 transition-all duration-300 hover:border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isRecurring: e.target.checked,
                    recurrenceEnd: e.target.checked ? prev.recurrenceEnd : "",
                  }))
                }
                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900 transition-all duration-300"
              />
              <label
                htmlFor="isRecurring"
                className="text-sm font-medium text-gray-900 cursor-pointer transition-all duration-300 hover:text-gray-700"
              >
                Make this a recurring event
              </label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-3 pl-7 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
                      Repeat
                    </label>
                    <select
                      value={formData.recurrenceType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          recurrenceType: e.target.value as
                            | "DAILY"
                            | "WEEKLY"
                            | "MONTHLY",
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-105"
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
                      End Date (Optional)
                    </label>
                    <DatePicker
                      label=""
                      date={formData.recurrenceEnd}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          recurrenceEnd: value,
                        }))
                      }
                      minDate={formData.date}
                      placeholder="No end date"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {formData.recurrenceType === "DAILY" &&
                    "Event will repeat every day"}
                  {formData.recurrenceType === "WEEKLY" &&
                    "Event will repeat weekly on the same day"}
                  {formData.recurrenceType === "MONTHLY" &&
                    "Event will repeat monthly on the same date"}
                  {formData.recurrenceEnd &&
                    ` until ${new Date(
                      formData.recurrenceEnd
                    ).toLocaleDateString()}`}
                </div>
              </div>
            )}
          </div>
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
            </div>{" "}
            <div className="group">
              <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
                Expected Attendees
                {formData.venueId && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Max:{" "}
                    {venues.find((v) => v.id.toString() === formData.venueId)
                      ?.capacity || 0}
                    )
                  </span>
                )}
              </label>
              <input
                type="number"
                name="capacity"
                required
                min="1"
                max={
                  formData.venueId
                    ? venues.find((v) => v.id.toString() === formData.venueId)
                        ?.capacity
                    : undefined
                }
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-105"
                placeholder="Number of attendees"
              />
              {formData.venueId &&
                formData.capacity &&
                parseInt(formData.capacity) >
                  (venues.find((v) => v.id.toString() === formData.venueId)
                    ?.capacity || 0) && (
                  <div className="text-red-600 text-xs mt-1">
                    Capacity exceeds venue limit of{" "}
                    {
                      venues.find((v) => v.id.toString() === formData.venueId)
                        ?.capacity
                    }
                  </div>
                )}
            </div>
          </div>{" "}
          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
                Event Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-105"
              >
                <option value="ACADEMIC">Academic</option>
                <option value="SPIRITUAL">Spiritual</option>
                <option value="SOCIAL">Social</option>
                <option value="STUDENT_ORG">Student Organization</option>
                <option value="SPORTS">Sports</option>
                <option value="CULTURAL">Cultural</option>
              </select>
            </div>
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
          </div>
          {/* Department */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
              Department/Organization (Optional)
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-105"
              placeholder="e.g., Computer Science, Student Affairs, etc."
            />{" "}
          </div>{" "}
          {/* Resource Requests */}
          <div className="group">
            <EventResourceRequest
              eventDate={formData.date}
              resourceRequests={resourceRequests}
              onAddRequest={addResourceRequest}
              onRemoveRequest={removeResourceRequest}
              onUpdateRequest={updateResourceRequest}
            />
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
