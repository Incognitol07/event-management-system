"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  Calendar,
  Users,
  MapPin,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  BarChart3,
  MessageSquare,
  Settings,
  Download,
  Star,
  Building,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { EventCard } from "../events/event-card";
import { useState } from "react";
import { EventForm } from "../events/event-form";

// Mock data - role-specific
const mockAdminStats = {
  totalEvents: 48,
  thisMonthEvents: 12,
  totalAttendees: 2850,
  averageAttendance: 89.5,
  totalOrganizers: 15,
  totalLocations: 25,
  systemHealth: 98.5,
};

const mockOrganizerStats = {
  myEvents: 8,
  thisMonthEvents: 3,
  totalAttendees: 450,
  averageAttendance: 85.2,
  avgRating: 4.3,
  pendingApprovals: 2,
};

const mockAttendeeStats = {
  registeredEvents: 5,
  upcomingEvents: 3,
  attendedEvents: 12,
  favoriteCategories: ["Technology", "Academic", "Social"],
};

const mockUpcomingEvents = [
  {
    id: 1,
    eventName: "AI in Education Symposium",
    eventDate: new Date("2025-07-15"),
    startTime: new Date("2025-07-15T09:00:00"),
    location: { locationName: "Main Auditorium" },
    _count: { eventAttendees: 342 },
    eventOrganizers: [{ organizer: { orgName: "CS Department" } }],
  },
  {
    id: 2,
    eventName: "Student Orientation",
    eventDate: new Date("2025-08-25"),
    startTime: new Date("2025-08-25T10:00:00"),
    location: { locationName: "Outdoor Plaza" },
    _count: { eventAttendees: 756 },
    eventOrganizers: [{ organizer: { orgName: "Student Affairs" } }],
  },
  {
    id: 3,
    eventName: "Programming Workshop",
    eventDate: new Date("2025-08-05"),
    startTime: new Date("2025-08-05T14:00:00"),
    location: { locationName: "Computer Lab 1" },
    _count: { eventAttendees: 15 },
    eventOrganizers: [{ organizer: { orgName: "CS Department" } }],
  },
];

const mockRecentActivity = [
  {
    id: 1,
    action: "New registration",
    event: "AI Symposium",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "Event updated",
    event: "Student Orientation",
    time: "4 hours ago",
  },
  {
    id: 3,
    action: "Feedback received",
    event: "Programming Workshop",
    time: "6 hours ago",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderWelcomeSection = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === "admin" && "Manage your entire event ecosystem"}
            {user.role === "organizer" && "Create and manage your events"}
            {user.role === "attendee" && "Discover and register for events"}
          </p>
        </div>
        <Badge
          className={
            user.role === "admin"
              ? "bg-red-100 text-red-700"
              : user.role === "organizer"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {renderWelcomeSection()}

      {/* Admin Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAdminStats.totalEvents}
            </div>
            <p className="text-xs text-muted-foreground">
              +{mockAdminStats.thisMonthEvents} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Attendees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAdminStats.totalAttendees.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockAdminStats.averageAttendance}% avg attendance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Organizers
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAdminStats.totalOrganizers}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockAdminStats.totalLocations} locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAdminStats.systemHealth}%
            </div>
            <p className="text-xs text-green-600">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              onClick={() => setIsEventFormOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Organizers
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              Add Location
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentActivity.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 text-sm">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-gray-600"> for {activity.event}</span>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderOrganizerDashboard = () => (
    <div className="space-y-6">
      {renderWelcomeSection()}

      {/* Organizer Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockOrganizerStats.myEvents}
            </div>
            <p className="text-xs text-muted-foreground">
              +{mockOrganizerStats.thisMonthEvents} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Attendees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockOrganizerStats.totalAttendees}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockOrganizerStats.averageAttendance}% avg attendance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockOrganizerStats.avgRating}
            </div>
            <p className="text-xs text-muted-foreground">Based on feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockOrganizerStats.pendingApprovals}
            </div>
            <p className="text-xs text-orange-600">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Organizer Actions and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              onClick={() => setIsEventFormOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Check Feedback
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUpcomingEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{event.eventName}</h4>
                      <Badge variant="outline">
                        {event._count.eventAttendees} registered
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.eventDate)} at{" "}
                      {formatTime(event.startTime)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {event.location.locationName}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderAttendeeDashboard = () => (
    <div className="space-y-6">
      {renderWelcomeSection()}

      {/* Attendee Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAttendeeStats.registeredEvents}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockAttendeeStats.upcomingEvents} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Events Attended
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAttendeeStats.attendedEvents}
            </div>
            <p className="text-xs text-muted-foreground">Total participation</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Favorite Categories
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mockAttendeeStats.favoriteCategories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendee Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUpcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{event.eventName}</h4>
                    <Badge className="bg-green-100 text-green-700">
                      Registered
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(event.eventDate)} at{" "}
                    {formatTime(event.startTime)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {event.location.locationName}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUpcomingEvents.slice(1, 4).map((event) => (
                <div key={event.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{event.eventName}</h4>
                    <Button size="sm">Register</Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(event.eventDate)} at{" "}
                    {formatTime(event.startTime)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {event.location.locationName}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div>
      {user.role === "admin" && renderAdminDashboard()}
      {user.role === "organizer" && renderOrganizerDashboard()}
      {user.role === "attendee" && renderAttendeeDashboard()}

      {/* Event Form Modal */}
      {isEventFormOpen &&
        (user.role === "admin" || user.role === "organizer") && (
          <EventForm
            isOpen={isEventFormOpen}
            onClose={() => setIsEventFormOpen(false)}
            onSubmit={(data) => {
              console.log("Event submitted:", data);
              setIsEventFormOpen(false);
            }}
            mode="create"
          />
        )}
    </div>
  );
};

export { Dashboard };
