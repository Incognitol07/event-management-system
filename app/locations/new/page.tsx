"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ProtectedHeader from "@/components/layout/protected-header";

export default function NewVenuePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role !== "ADMIN") {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          capacity: parseInt(formData.capacity),
        }),
      });

      if (response.ok) {
        const newVenue = await response.json();
        router.push(`/locations/${newVenue.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create venue");
      }
    } catch (error) {
      console.error("Failed to create venue:", error);
      alert("Failed to create venue");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-4xl font-light text-gray-400">...</div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    router.push("/locations");
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <ProtectedHeader currentPage="venues" />

      <main className="max-w-2xl mx-auto px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900 mb-6 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to Venues</span>
        </button>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-900">New Venue</h1>
          <p className="text-sm text-gray-600 mt-1">
            Add a new venue for hosting events
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Venue Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter venue name"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Capacity *
            </label>
            <input
              type="number"
              id="capacity"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Maximum number of people"
              min="1"
              required
              disabled={submitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum number of people the venue can accommodate
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={submitting}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                submitting ||
                !formData.name.trim() ||
                !formData.capacity ||
                parseInt(formData.capacity) < 1
              }
              className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create Venue"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
