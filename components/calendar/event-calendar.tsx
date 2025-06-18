"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Filter,
} from "lucide-react";
import { formatTime } from "@/lib/utils";

// Mock events data
const mockEvents = [
  {
    id: 1,
    eventName: "AI in Education Symposium",
    eventDate: new Date("2025-07-15"),
    startTime: new Date("2025-07-15T09:00:00"),
    endTime: new Date("2025-07-15T17:00:00"),
    location: { locationName: "Main Auditorium", capacity: 500 },
    isRecurring: false,
    _count: { eventAttendees: 342 },
    eventOrganizers: [{ organizer: { orgName: "CS Department" } }],
    isRegistered: false,
    canRegister: true,
  },
  {
    id: 2,
    eventName: "Student Orientation",
    eventDate: new Date("2025-06-25"),
    startTime: new Date("2025-06-25T10:00:00"),
    endTime: new Date("2025-06-25T15:00:00"),
    location: { locationName: "Outdoor Plaza", capacity: 1000 },
    isRecurring: false,
    _count: { eventAttendees: 756 },
    eventOrganizers: [{ organizer: { orgName: "Student Affairs" } }],
    isRegistered: true,
    canRegister: false,
  },
  {
    id: 3,
    eventName: "Weekly Faculty Meeting",
    eventDate: new Date("2025-06-20"),
    startTime: new Date("2025-06-20T14:00:00"),
    endTime: new Date("2025-06-20T16:00:00"),
    location: { locationName: "Conference Room A", capacity: 50 },
    isRecurring: true,
    _count: { eventAttendees: 32 },
    eventOrganizers: [{ organizer: { orgName: "Administration" } }],
    isRegistered: false,
    canRegister: true,
  },
];

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [events, setEvents] = useState(mockEvents);

  const handleRegister = (eventId: number) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isRegistered: true,
              _count: { eventAttendees: event._count.eventAttendees + 1 },
            }
          : event
      )
    );
  };

  const handleUnregister = (eventId: number) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isRegistered: false,
              _count: {
                eventAttendees: Math.max(0, event._count.eventAttendees - 1),
              },
            }
          : event
      )
    );
  };

  // Filter events for the current view
  const getEventsForView = () => {
    const today = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    return events.filter((event) => {
      const eventDate = new Date(event.eventDate);
      if (viewMode === "month") {
        return eventDate >= startOfMonth && eventDate <= endOfMonth;
      }
      return eventDate >= today; // Show upcoming events
    });
  };

  const visibleEvents = getEventsForView();

  // Generate calendar days for month view
  const generateCalendarDays = () => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const startOfCalendar = new Date(startOfMonth);
    startOfCalendar.setDate(startOfCalendar.getDate() - startOfMonth.getDay());

    const days = [];
    const currentCalendarDate = new Date(startOfCalendar);

    for (let i = 0; i < 42; i++) {
      // 6 weeks * 7 days
      const dayEvents = events.filter(
        (event) =>
          new Date(event.eventDate).toDateString() ===
          currentCalendarDate.toDateString()
      );

      days.push({
        date: new Date(currentCalendarDate),
        events: dayEvents,
        isCurrentMonth:
          currentCalendarDate.getMonth() === currentDate.getMonth(),
        isToday:
          currentCalendarDate.toDateString() === new Date().toDateString(),
      });

      currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Calendar</h1>
          <p className="text-gray-600">View and register for upcoming events</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
          >
            Month
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            Week
          </Button>
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("day")}
          >
            Day
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {currentDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("prev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "month" && (
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-sm font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    )
                  )}
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        !day.isCurrentMonth ? "text-gray-400 bg-gray-50/50" : ""
                      } ${day.isToday ? "bg-blue-50 border-blue-200" : ""}`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div
                        className={`text-sm font-medium ${
                          day.isToday ? "text-blue-600" : ""
                        }`}
                      >
                        {day.date.getDate()}
                      </div>
                      <div className="mt-1 space-y-1">
                        {day.events.slice(0, 2).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                          >
                            {event.eventName}
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Event List Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {visibleEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No events scheduled
                </p>
              ) : (
                visibleEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">
                      {event.eventName}
                    </h4>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(event.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location.locationName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {event._count.eventAttendees} /{" "}
                          {event.location.capacity}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2">
                        {event.isRecurring && (
                          <Badge variant="secondary" className="text-xs">
                            Recurring
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {event.eventOrganizers[0]?.organizer.orgName}
                        </Badge>
                      </div>

                      {event.isRegistered ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="success" className="text-xs">
                            Registered
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnregister(event.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : event.canRegister ? (
                        <Button
                          size="sm"
                          onClick={() => handleRegister(event.id)}
                          disabled={
                            event._count.eventAttendees >=
                            event.location.capacity
                          }
                        >
                          {event._count.eventAttendees >=
                          event.location.capacity
                            ? "Full"
                            : "Register"}
                        </Button>
                      ) : (
                        <Badge variant="outline">Closed</Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { EventCalendar };
