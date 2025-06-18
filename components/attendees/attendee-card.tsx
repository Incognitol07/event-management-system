"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  GraduationCap,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Attendee {
  id: number;
  attendeeName: string;
  email: string;
  studentId?: string;
  eventAttendees: Array<{
    event: {
      eventName: string;
      eventDate: Date;
    };
    registrationDate: Date;
  }>;
}

interface AttendeeCardProps {
  attendee: Attendee;
  onEdit?: (attendee: Attendee) => void;
  onDelete?: (attendee: Attendee) => void;
  onViewDetails?: (attendee: Attendee) => void;
}

const AttendeeCard = ({
  attendee,
  onEdit,
  onDelete,
  onViewDetails,
}: AttendeeCardProps) => {
  const eventsCount = attendee.eventAttendees?.length || 0;
  const isStudent = !!attendee.studentId;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {attendee.attendeeName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={isStudent ? "default" : "secondary"}
                  className="text-xs"
                >
                  {isStudent ? "Student" : "Staff"}
                </Badge>
                {isStudent && attendee.studentId && (
                  <Badge variant="outline" className="text-xs">
                    ID: {attendee.studentId}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(attendee);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(attendee);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent
        className="space-y-3"
        onClick={() => onViewDetails?.(attendee)}
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          <span className="truncate">{attendee.email}</span>
        </div>

        {isStudent && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <GraduationCap className="h-4 w-4" />
            <span>Student ID: {attendee.studentId}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {eventsCount} event{eventsCount !== 1 ? "s" : ""} registered
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {eventsCount > 0 ? "Active" : "No events"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { AttendeeCard };
