"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventCard } from "./event-card";
import { EventForm } from "./event-form";
import { EventDetails } from "./event-details";
import { Plus, Filter, Calendar, List, Grid } from "lucide-react";

// Mock data - replace with actual API calls
const mockEvents = [
  {
    id: 1,
    eventName: "AI in Education Symposium",
    eventDate: new Date("2025-07-15"),
    startTime: new Date("2025-07-15T09:00:00"),
    endTime: new Date("2025-07-15T17:00:00"),
    location: {
      locationName: "Main Auditorium",
      capacity: 500,
    },
    isRecurring: false,
    _count: {
      eventAttendees: 342,
    },
    eventOrganizers: [
      {
        organizer: {
          orgName: "Computer Science Department",
        },
        role: "Primary Organizer",
      },
    ],
  },
  {
    id: 2,
    eventName: "Weekly Faculty Meeting",
    eventDate: new Date("2025-06-20"),
    startTime: new Date("2025-06-20T14:00:00"),
    endTime: new Date("2025-06-20T16:00:00"),
    location: {
      locationName: "Conference Room A",
      capacity: 50,
    },
    isRecurring: true,
    _count: {
      eventAttendees: 32,
    },
    eventOrganizers: [
      {
        organizer: {
          orgName: "Administration",
        },
        role: "Primary Organizer",
      },
    ],
  },
  {
    id: 3,
    eventName: "Student Orientation",
    eventDate: new Date("2025-08-25"),
    startTime: new Date("2025-08-25T10:00:00"),
    endTime: new Date("2025-08-25T15:00:00"),
    location: {
      locationName: "Outdoor Plaza",
      capacity: 1000,
    },
    isRecurring: false,
    _count: {
      eventAttendees: 756,
    },
    eventOrganizers: [
      {
        organizer: {
          orgName: "Student Affairs",
        },
        role: "Primary Organizer",
      },
    ],
  },
];

interface EventsListProps {
  viewMode?: "grid" | "list";
}

const EventsList = ({ viewMode = "grid" }: EventsListProps) => {
  const [events, setEvents] = useState(mockEvents);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentViewMode, setCurrentViewMode] = useState<"grid" | "list">(
    viewMode
  );

  const filteredEvents = events.filter(
    (event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventOrganizers.some((org) =>
        org.organizer.orgName.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleCreateEvent = () => {
    setFormMode("create");
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setFormMode("edit");
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = (event: any) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    }
  };

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleFormSubmit = (eventData: any) => {
    if (formMode === "create") {
      const newEvent = {
        ...eventData,
        id: Date.now(),
        _count: { eventAttendees: 0 },
      };
      setEvents((prev) => [...prev, newEvent]);
    } else {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === selectedEvent.id ? { ...e, ...eventData } : e
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Manage and organize university events</p>
        </div>
        <Button onClick={handleCreateEvent} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search events or organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  events.filter(
                    (e) =>
                      new Date(e.eventDate).getMonth() === new Date().getMonth()
                  ).length
                }
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Attendees</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((sum, e) => sum + e._count.eventAttendees, 0)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Events Grid/List */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No events found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by creating a new event."}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={handleCreateEvent}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
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
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <EventForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedEvent}
        mode={formMode}
      />

      <EventDetails
        event={selectedEvent}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={() => {
          setIsDetailsOpen(false);
          handleEditEvent(selectedEvent);
        }}
        onDelete={() => {
          setIsDetailsOpen(false);
          handleDeleteEvent(selectedEvent);
        }}
      />
    </div>
  );
};

export { EventsList };
