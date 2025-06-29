"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ProtectedHeader from "@/components/layout/protected-header";

type Venue = {
  id: number;
  name: string;
  capacity: number;
};

type VenueWithEvents = Venue & {
  _count: { events: number };
};

export default function LocationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [venues, setVenues] = useState<VenueWithEvents[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchVenues();
    }
  }, [user]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/venues");
      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      }
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    } finally {
      setLoading(false);
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

  const canCreateVenue = user.role === "ADMIN";
  return (
    <div className="min-h-screen bg-white">
      <ProtectedHeader currentPage="venues" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Page header with new venue button */}
        {canCreateVenue && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-light text-gray-900">Venues</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage venue locations and details
              </p>
            </div>
            <button
              onClick={() => router.push("/locations/new")}
              className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 w-full sm:w-auto touch-manipulation active:scale-95"
            >
              New Venue
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="group border border-gray-100 p-4 sm:p-6 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer rounded-lg touch-manipulation"
              onClick={() => router.push(`/locations/${venue.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                  {venue.name}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-12">
                  🏛️
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-medium text-gray-900">
                    {venue.capacity} people
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Events hosted</span>
                  <span className="font-medium text-gray-900">
                    {venue._count?.events || 0}
                  </span>
                </div>
              </div>

              <div className="h-0.5 w-0 bg-gray-900 transition-all duration-500 group-hover:w-full"></div>
            </div>
          ))}
        </div>

        {venues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4 opacity-60">🏛️</div>
            <p className="text-gray-600">
              No venues available yet
              <span className="inline-block ml-1 transition-transform duration-300 hover:rotate-12">
                ✨
              </span>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
