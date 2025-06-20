"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, MapPin, Users, Calendar } from "lucide-react";

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

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Venues</h1>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading venues...</div>
        ) : venues.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No venues found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div key={venue.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {venue.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Capacity: {venue.capacity}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{venue._count?.events || 0} events scheduled</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Available for event scheduling
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Venue Booking Guidelines
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Events cannot overlap in the same venue</li>
            <li>• Expected attendance must not exceed venue capacity</li>
            <li>
              • Higher priority events take precedence in case of conflicts
            </li>
            <li>• Emergency events may bypass normal scheduling rules</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
