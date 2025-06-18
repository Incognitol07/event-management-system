"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AttendeeCard } from "./attendee-card";
import { AttendeeForm } from "./attendee-form";
import { Plus, Filter, Users, Grid, List } from "lucide-react";

// Mock data - replace with actual API calls
const mockAttendees = [
  {
    id: 1,
    attendeeName: "Sarah Johnson",
    email: "sarah.johnson@university.edu",
    studentId: "STU001",
    eventAttendees: [
      {
        event: { eventName: "AI Symposium", eventDate: new Date("2025-07-15") },
        registrationDate: new Date("2025-06-01"),
      },
      {
        event: {
          eventName: "Student Orientation",
          eventDate: new Date("2025-08-25"),
        },
        registrationDate: new Date("2025-06-15"),
      },
    ],
  },
  {
    id: 2,
    attendeeName: "Dr. Michael Chen",
    email: "m.chen@university.edu",
    studentId: undefined,
    eventAttendees: [
      {
        event: {
          eventName: "Faculty Meeting",
          eventDate: new Date("2025-06-20"),
        },
        registrationDate: new Date("2025-06-10"),
      },
    ],
  },
  {
    id: 3,
    attendeeName: "Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    studentId: "STU002",
    eventAttendees: [
      {
        event: { eventName: "AI Symposium", eventDate: new Date("2025-07-15") },
        registrationDate: new Date("2025-06-05"),
      },
    ],
  },
];

interface AttendeesListProps {
  viewMode?: "grid" | "list";
}

const AttendeesList = ({ viewMode = "grid" }: AttendeesListProps) => {
  const [attendees, setAttendees] = useState(mockAttendees);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<any>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "students" | "staff">(
    "all"
  );
  const [currentViewMode, setCurrentViewMode] = useState<"grid" | "list">(
    viewMode
  );

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.attendeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (attendee.studentId &&
        attendee.studentId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter =
      filterType === "all" ||
      (filterType === "students" && attendee.studentId) ||
      (filterType === "staff" && !attendee.studentId);

    return matchesSearch && matchesFilter;
  });

  const handleCreateAttendee = () => {
    setFormMode("create");
    setSelectedAttendee(null);
    setIsFormOpen(true);
  };

  const handleEditAttendee = (attendee: any) => {
    setFormMode("edit");
    setSelectedAttendee(attendee);
    setIsFormOpen(true);
  };

  const handleDeleteAttendee = (attendee: any) => {
    if (confirm("Are you sure you want to delete this attendee?")) {
      setAttendees((prev) => prev.filter((a) => a.id !== attendee.id));
    }
  };

  const handleFormSubmit = (attendeeData: any) => {
    if (formMode === "create") {
      const newAttendee = {
        ...attendeeData,
        id: Date.now(),
        eventAttendees: [],
      };
      setAttendees((prev) => [...prev, newAttendee]);
    } else {
      setAttendees((prev) =>
        prev.map((a) =>
          a.id === selectedAttendee.id ? { ...a, ...attendeeData } : a
        )
      );
    }
  };

  const studentCount = attendees.filter((a) => a.studentId).length;
  const staffCount = attendees.filter((a) => !a.studentId).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendees</h1>
          <p className="text-gray-600">
            Manage event attendees and registrations
          </p>
        </div>
        <Button onClick={handleCreateAttendee} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Attendee
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search attendees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Attendees</option>
            <option value="students">Students Only</option>
            <option value="staff">Staff Only</option>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Attendees</p>
              <p className="text-2xl font-bold text-gray-900">
                {attendees.length}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-2xl font-bold text-gray-900">{studentCount}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staffCount}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Attendees Grid/List */}
      {filteredAttendees.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No attendees found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding a new attendee."}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={handleCreateAttendee}>
                <Plus className="h-4 w-4 mr-2" />
                Add Attendee
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
          {filteredAttendees.map((attendee) => (
            <AttendeeCard
              key={attendee.id}
              attendee={attendee}
              onEdit={handleEditAttendee}
              onDelete={handleDeleteAttendee}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AttendeeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedAttendee}
        mode={formMode}
      />
    </div>
  );
};

export { AttendeesList };
