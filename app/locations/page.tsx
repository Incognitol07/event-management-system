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

  return (
    <div className="min-h-screen bg-white">
      <ProtectedHeader
        title="Venues"
        subtitle="Beautiful spaces for memorable events 🏛️"
        showNavigation={true}
        currentPage="venues"
      />

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="group border border-gray-100 p-6 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
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
