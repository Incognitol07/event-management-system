"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

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
  return (
    <div className="min-h-screen bg-white">
      {/* Compact header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Dashboard
            </button>
            <h1 className="text-xl font-medium text-gray-900">Venues</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {venues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No venues found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="border border-gray-200 p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {venue.name}
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <div className="font-medium text-gray-900">Capacity</div>
                    <div>{venue.capacity} people</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Events</div>
                    <div>{venue._count?.events || 0} scheduled</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Status</div>
                    <div className="text-green-600">Available</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Compact Guidelines */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Booking Guidelines
          </h2>
          <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
            <div className="space-y-2">
              <p>• Events cannot overlap in the same venue</p>
              <p>• Attendance must not exceed venue capacity</p>
            </div>
            <div className="space-y-2">
              <p>• Higher priority events take precedence</p>
              <p>• Emergency events may bypass normal rules</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
