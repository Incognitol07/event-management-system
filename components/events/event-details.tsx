"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Building,
  Repeat,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

interface EventDetailsProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EventDetails = ({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: EventDetailsProps) => {
  if (!event) return null;

  const attendeeCount = event._count?.eventAttendees || 0;
  const capacity = event.location?.capacity || 0;
  const occupancyPercentage =
    capacity > 0 ? (attendeeCount / capacity) * 100 : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event.eventName} size="xl">
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Event
            </Button>
          )}
        </div>

        {/* Event Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(event.eventDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{event.location?.locationName}</p>
                  <p className="text-sm text-gray-500">Capacity: {capacity}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Attendance</p>
                  <p className="font-medium">
                    {attendeeCount} / {capacity} registered
                  </p>
                  <p className="text-sm text-gray-500">
                    {occupancyPercentage.toFixed(1)}% full
                  </p>
                </div>
              </div>
            </div>

            {event.description && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-700">{event.description}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4">
              {event.isRecurring && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Repeat className="h-3 w-3" />
                  Recurring Event
                </Badge>
              )}
              <Badge
                variant={
                  occupancyPercentage >= 90
                    ? "destructive"
                    : occupancyPercentage >= 70
                    ? "warning"
                    : "success"
                }
              >
                {occupancyPercentage >= 90
                  ? "Nearly Full"
                  : occupancyPercentage >= 70
                  ? "Filling Up"
                  : "Available"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Organizers */}
        {event.eventOrganizers && event.eventOrganizers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organizers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {event.eventOrganizers.map((orgRel: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {orgRel.organizer?.orgName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {orgRel.organizer?.orgContact}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{orgRel.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Attendees */}
        {event.eventAttendees && event.eventAttendees.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Recent Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {event.eventAttendees
                  .slice(0, 5)
                  .map((attendeeRel: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {attendeeRel.attendee?.attendeeName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {attendeeRel.attendee?.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {formatDate(attendeeRel.registrationDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                {attendeeCount > 5 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    And {attendeeCount - 5} more attendees...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resources */}
        {event.eventResources && event.eventResources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Resources Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.eventResources.map((resourceRel: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">
                      {resourceRel.resource?.resourceName}
                    </span>
                    <Badge variant="outline">
                      {resourceRel.quantityNeeded} needed
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Modal>
  );
};

export { EventDetails };
