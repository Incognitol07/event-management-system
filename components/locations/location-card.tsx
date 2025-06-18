"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, Edit, Trash2 } from "lucide-react";

interface Location {
  id: number;
  locationName: string;
  capacity: number;
  events?: Array<{
    eventName: string;
    eventDate: Date;
    _count: {
      eventAttendees: number;
    };
  }>;
}

interface LocationCardProps {
  location: Location;
  onEdit?: (location: Location) => void;
  onDelete?: (location: Location) => void;
  onViewDetails?: (location: Location) => void;
}

const LocationCard = ({
  location,
  onEdit,
  onDelete,
  onViewDetails,
}: LocationCardProps) => {
  const eventsCount = location.events?.length || 0;
  const totalAttendees =
    location.events?.reduce(
      (sum, event) => sum + event._count.eventAttendees,
      0
    ) || 0;
  const averageOccupancy =
    eventsCount > 0
      ? (totalAttendees / (eventsCount * location.capacity)) * 100
      : 0;

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-100 text-red-800";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {location.locationName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  Capacity: {location.capacity}
                </Badge>
                {averageOccupancy > 0 && (
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getOccupancyColor(averageOccupancy)}`}
                  >
                    {averageOccupancy.toFixed(0)}% avg. full
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
                  onEdit(location);
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
                  onDelete(location);
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
        onClick={() => onViewDetails?.(location)}
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>Maximum capacity: {location.capacity} people</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {eventsCount} event{eventsCount !== 1 ? "s" : ""} scheduled
          </span>
        </div>

        {eventsCount > 0 && (
          <div className="pt-2 border-t">
            <div className="text-xs text-gray-500 mb-2">Recent Events:</div>
            <div className="space-y-1">
              {location.events?.slice(0, 2).map((event, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-700 bg-gray-50 rounded px-2 py-1"
                >
                  {event.eventName}
                </div>
              ))}
              {eventsCount > 2 && (
                <div className="text-xs text-gray-500">
                  +{eventsCount - 2} more events
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { LocationCard };
