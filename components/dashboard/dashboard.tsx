"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  MapPin,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

// Mock data - replace with actual API calls
const mockStats = {
  totalEvents: 24,
  thisMonthEvents: 8,
  totalAttendees: 1430,
  averageAttendance: 89.5,
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
];

const mockRecentActivity = [
  {
    id: 1,
    action: "New registration",
    event: "AI Symposium",
    user: "John Doe",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "Event created",
    event: "Faculty Meeting",
    user: "Admin",
    time: "4 hours ago",
  },
  {
    id: 3,
    action: "Registration cancelled",
    event: "Workshop",
    user: "Jane Smith",
    time: "6 hours ago",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {mockStats.totalEvents}
                </p>
                <p className="text-xs text-blue-600 mt-1">+3 from last month</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">This Month</p>
                <p className="text-2xl font-bold text-green-900">
                  {mockStats.thisMonthEvents}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +2 from last month
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Total Attendees
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {mockStats.totalAttendees.toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  +12% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Avg. Attendance
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {mockStats.averageAttendance}%
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  +5% from last month
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockUpcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {event.eventName}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(event.eventDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(event.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {event._count.eventAttendees} registered
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {event.eventOrganizers[0]?.organizer.orgName}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Events
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.action}</span> for{" "}
                    <span className="font-medium text-blue-600">
                      {activity.event}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span>Create Event</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Manage Attendees</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MapPin className="h-6 w-6" />
              <span>Add Location</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { Dashboard };
