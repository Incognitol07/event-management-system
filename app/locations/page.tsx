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
      {/* Delightful header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 group"
            >
              <span className="transition-all duration-300 group-hover:tracking-wider">
                ← Dashboard
              </span>
            </button>
            <div className="group cursor-default">
              <h1 className="text-xl font-medium text-gray-900 transition-all duration-300 group-hover:scale-105">
                Venues
              </h1>
              <div className="h-0.5 w-0 bg-gray-900 transition-all duration-500 group-hover:w-8"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">
            Perfect spaces for amazing events
            <span className="inline-block ml-1 transition-transform duration-300 hover:rotate-12 hover:scale-110">
              🏛️
            </span>
          </p>
        </div>{" "}
        {venues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No venues found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="border border-gray-200 p-6 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-sm group cursor-default"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="group">
                    <h3 className="text-lg font-medium text-gray-900 transition-all duration-300 group-hover:text-gray-700">
                      {venue.name}
                    </h3>
                    <div className="h-0.5 w-0 bg-gray-900 transition-all duration-500 group-hover:w-12"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
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
        )}{" "}
        {/* Delightful Guidelines */}
        <div className="mt-8 pt-6 border-t border-gray-100 group">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 transition-all duration-300 group-hover:text-gray-700">
              Booking Guidelines
            </h2>
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:rotate-12 hover:scale-110">
              📋
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
            <div className="space-y-2">
              <p className="hover:text-gray-900 transition-colors duration-300">
                • Events cannot overlap in the same venue
              </p>
              <p className="hover:text-gray-900 transition-colors duration-300">
                • Attendance must not exceed venue capacity
              </p>
            </div>
            <div className="space-y-2">
              <p className="hover:text-gray-900 transition-colors duration-300">
                • Higher priority events take precedence
              </p>
              <p className="hover:text-gray-900 transition-colors duration-300">
                • Emergency events may bypass normal rules
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
