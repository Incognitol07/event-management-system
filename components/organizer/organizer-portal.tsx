"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  TrendingUp,
  Plus,
  MessageSquare,
  BarChart3,
  Settings,
  Download,
} from "lucide-react";
import { EventCard } from "../events/event-card";
import { EventForm } from "../events/event-form";

// Mock data for organizer
const mockOrganizerData = {
  organizer: {
    id: 1,
    orgName: "Computer Science Department",
    orgContact: "cs.admin@university.edu",
  },
  events: [
    {
      id: 1,
      eventName: "AI in Education Symposium",
      eventDate: new Date("2025-07-15"),
      startTime: new Date("2025-07-15T09:00:00"),
      endTime: new Date("2025-07-15T17:00:00"),
      location: { locationName: "Main Auditorium", capacity: 500 },
      isRecurring: false,
      _count: { eventAttendees: 342 },
      eventOrganizers: [
        { organizer: { orgName: "CS Department" }, role: "Primary Organizer" },
      ],
      status: "published",
    },
    {
      id: 2,
      eventName: "Programming Workshop",
      eventDate: new Date("2025-08-05"),
      startTime: new Date("2025-08-05T14:00:00"),
      endTime: new Date("2025-08-05T18:00:00"),
      location: { locationName: "Computer Lab 1", capacity: 30 },
      isRecurring: false,
      _count: { eventAttendees: 15 },
      eventOrganizers: [
        { organizer: { orgName: "CS Department" }, role: "Primary Organizer" },
      ],
      status: "draft",
    },
  ],
  stats: {
    totalEvents: 5,
    totalAttendees: 450,
    avgAttendance: 85.2,
    avgRating: 4.3,
  },
};

const OrganizerPortal = () => {
  const [data, setData] = useState(mockOrganizerData);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const handleCreateEvent = () => {
    setFormMode("create");
    setSelectedEvent(null);
    setIsEventFormOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setFormMode("edit");
    setSelectedEvent(event);
    setIsEventFormOpen(true);
  };

  const handleEventSubmit = (eventData: any) => {
    if (formMode === "create") {
      const newEvent = {
        ...eventData,
        id: Date.now(),
        _count: { eventAttendees: 0 },
        status: "draft",
        eventOrganizers: [
          {
            organizer: { orgName: data.organizer.orgName },
            role: "Primary Organizer",
          },
        ],
      };
      setData((prev) => ({
        ...prev,
        events: [...prev.events, newEvent],
      }));
    } else {
      setData((prev) => ({
        ...prev,
        events: prev.events.map((e) =>
          e.id === selectedEvent.id ? { ...e, ...eventData } : e
        ),
      }));
    }
  };

  const handlePublishEvent = (eventId: number) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId ? { ...e, status: "published" } : e
      ),
    }));
  };

  const upcomingEvents = data.events.filter(
    (e) => new Date(e.eventDate) > new Date()
  );
  const draftEvents = data.events.filter((e) => e.status === "draft");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizer Portal</h1>
          <p className="text-gray-600">
            Welcome back, {data.organizer.orgName}
          </p>
        </div>
        <Button onClick={handleCreateEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {data.stats.totalEvents}
                </p>
                <p className="text-xs text-blue-600 mt-1">All time</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Total Attendees
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {data.stats.totalAttendees}
                </p>
                <p className="text-xs text-green-600 mt-1">Across all events</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Avg. Attendance
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {data.stats.avgAttendance}%
                </p>
                <p className="text-xs text-purple-600 mt-1">Capacity filled</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">
                  Avg. Rating
                </p>
                <p className="text-2xl font-bold text-yellow-900">
                  {data.stats.avgRating}/5
                </p>
                <p className="text-xs text-yellow-600 mt-1">Event feedback</p>
              </div>
              <MessageSquare className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              onClick={handleCreateEvent}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Attendee List
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              View Feedback
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Organizer Settings
            </Button>
          </CardContent>
        </Card>

        {/* Draft Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Draft Events
              <Badge variant="secondary">{draftEvents.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {draftEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No draft events</p>
            ) : (
              draftEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <h4 className="font-medium text-gray-900">
                    {event.eventName}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => handleEditEvent(event)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublishEvent(event.id)}
                    >
                      Publish
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    New registration for AI Symposium
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Event feedback received</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Workshop capacity updated
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Events */}
      <Card>
        <CardHeader>
          <CardTitle>My Events</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No upcoming events
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first event to get started.
              </p>
              <div className="mt-6">
                <Button onClick={handleCreateEvent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="relative">
                  <EventCard event={event} onEdit={handleEditEvent} />
                  {event.status === "draft" && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        Draft
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Form Modal */}
      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        onSubmit={handleEventSubmit}
        initialData={selectedEvent}
        mode={formMode}
      />
    </div>
  );
};

export { OrganizerPortal };
