"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

interface Event {
  id: number;
  eventName: string;
  eventDate: Date;
  startTime: Date;
  endTime: Date;
  location: {
    locationName: string;
    capacity: number;
  };
  isRecurring: boolean;
  _count: {
    eventAttendees: number;
  };
  eventOrganizers: Array<{
    organizer: {
      orgName: string;
    };
    role: string;
  }>;
}

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onViewDetails?: (event: Event) => void;
}

const EventCard = ({
  event,
  onEdit,
  onDelete,
  onViewDetails,
}: EventCardProps) => {
  const attendeeCount = event._count.eventAttendees;
  const capacity = event.location.capacity;
  const occupancyPercentage = (attendeeCount / capacity) * 100;

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600 bg-red-50";
    if (percentage >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {event.eventName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              {event.isRecurring && (
                <Badge variant="secondary" className="text-xs">
                  Recurring
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {event.eventOrganizers[0]?.organizer.orgName}
              </Badge>
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
                  onEdit(event);
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
                  onDelete(event);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3" onClick={() => onViewDetails?.(event)}>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(event.eventDate)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{event.location.locationName}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              {attendeeCount} / {capacity} attendees
            </span>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${getOccupancyColor(
              occupancyPercentage
            )}`}
          >
            {occupancyPercentage.toFixed(0)}% full
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { EventCard };
