"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationCard } from "./location-card";
import { LocationForm } from "./location-form";
import { Plus, Filter, MapPin, Grid, List } from "lucide-react";

// Mock data - replace with actual API calls
const mockLocations = [
  {
    id: 1,
    locationName: "Main Auditorium",
    capacity: 500,
    description:
      "Large auditorium with state-of-the-art audio-visual equipment",
    address: "Building A, Ground Floor",
    events: [
      {
        eventName: "AI in Education Symposium",
        eventDate: new Date("2025-07-15"),
        _count: { eventAttendees: 342 },
      },
      {
        eventName: "Graduation Ceremony",
        eventDate: new Date("2025-08-30"),
        _count: { eventAttendees: 450 },
      },
    ],
  },
  {
    id: 2,
    locationName: "Conference Room A",
    capacity: 50,
    description:
      "Medium-sized conference room perfect for meetings and workshops",
    address: "Building B, 2nd Floor",
    events: [
      {
        eventName: "Faculty Meeting",
        eventDate: new Date("2025-06-20"),
        _count: { eventAttendees: 32 },
      },
    ],
  },
  {
    id: 3,
    locationName: "Outdoor Plaza",
    capacity: 1000,
    description: "Open-air venue suitable for large gatherings and festivals",
    address: "Central Campus",
    events: [
      {
        eventName: "Student Orientation",
        eventDate: new Date("2025-08-25"),
        _count: { eventAttendees: 756 },
      },
    ],
  },
  {
    id: 4,
    locationName: "Library Study Hall",
    capacity: 200,
    description: "Quiet study space that can be converted for academic events",
    address: "Library Building, 1st Floor",
    events: [],
  },
];

interface LocationsListProps {
  viewMode?: "grid" | "list";
}

const LocationsList = ({ viewMode = "grid" }: LocationsListProps) => {
  const [locations, setLocations] = useState(mockLocations);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [capacityFilter, setCapacityFilter] = useState<
    "all" | "small" | "medium" | "large"
  >("all");
  const [currentViewMode, setCurrentViewMode] = useState<"grid" | "list">(
    viewMode
  );

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCapacity =
      capacityFilter === "all" ||
      (capacityFilter === "small" && location.capacity <= 50) ||
      (capacityFilter === "medium" &&
        location.capacity > 50 &&
        location.capacity <= 200) ||
      (capacityFilter === "large" && location.capacity > 200);

    return matchesSearch && matchesCapacity;
  });

  const handleCreateLocation = () => {
    setFormMode("create");
    setSelectedLocation(null);
    setIsFormOpen(true);
  };

  const handleEditLocation = (location: any) => {
    setFormMode("edit");
    setSelectedLocation(location);
    setIsFormOpen(true);
  };

  const handleDeleteLocation = (location: any) => {
    if (confirm("Are you sure you want to delete this location?")) {
      setLocations((prev) => prev.filter((l) => l.id !== location.id));
    }
  };

  const handleFormSubmit = (locationData: any) => {
    if (formMode === "create") {
      const newLocation = {
        ...locationData,
        id: Date.now(),
        events: [],
      };
      setLocations((prev) => [...prev, newLocation]);
    } else {
      setLocations((prev) =>
        prev.map((l) =>
          l.id === selectedLocation.id ? { ...l, ...locationData } : l
        )
      );
    }
  };

  const totalCapacity = locations.reduce((sum, loc) => sum + loc.capacity, 0);
  const activeLocations = locations.filter(
    (loc) => loc.events && loc.events.length > 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600">Manage event venues and facilities</p>
        </div>
        <Button onClick={handleCreateLocation} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value as any)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Sizes</option>
            <option value="small">Small (≤50)</option>
            <option value="medium">Medium (51-200)</option>
            <option value="large">Large (200+)</option>
          </select>

          <div className="flex border rounded-lg">
            <Button
              variant={currentViewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={currentViewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Locations</p>
              <p className="text-2xl font-bold text-gray-900">
                {locations.length}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Venues</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeLocations}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCapacity.toLocaleString()}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {locations.length > 0
                  ? Math.round(totalCapacity / locations.length)
                  : 0}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Locations Grid/List */}
      {filteredLocations.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No locations found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding a new location."}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={handleCreateLocation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={
            currentViewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onEdit={handleEditLocation}
              onDelete={handleDeleteLocation}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <LocationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedLocation}
        mode={formMode}
      />
    </div>
  );
};

export { LocationsList };
