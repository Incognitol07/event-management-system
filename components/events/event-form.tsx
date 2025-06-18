"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Repeat, Plus, X } from "lucide-react";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: any) => void;
  initialData?: any;
  mode: "create" | "edit";
}

const EventForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: EventFormProps) => {
  const [formData, setFormData] = useState({
    eventName: initialData?.eventName || "",
    eventDate: initialData?.eventDate || "",
    startTime: initialData?.startTime || "",
    endTime: initialData?.endTime || "",
    locationId: initialData?.locationId || "",
    isRecurring: initialData?.isRecurring || false,
    recurStartDate: initialData?.recurStartDate || "",
    recurEndDate: initialData?.recurEndDate || "",
    description: initialData?.description || "",
    organizers: initialData?.organizers || [],
    resources: initialData?.resources || [],
  });

  const [newOrganizer, setNewOrganizer] = useState({ name: "", role: "" });
  const [newResource, setNewResource] = useState({ name: "", quantity: 1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addOrganizer = () => {
    if (newOrganizer.name && newOrganizer.role) {
      setFormData((prev) => ({
        ...prev,
        organizers: [...prev.organizers, { ...newOrganizer, id: Date.now() }],
      }));
      setNewOrganizer({ name: "", role: "" });
    }
  };

  const addResource = () => {
    if (newResource.name && newResource.quantity > 0) {
      setFormData((prev) => ({
        ...prev,
        resources: [...prev.resources, { ...newResource, id: Date.now() }],
      }));
      setNewResource({ name: "", quantity: 1 });
    }
  };

  const removeOrganizer = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      organizers: prev.organizers.filter((org: any) => org.id !== id),
    }));
  };

  const removeResource = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((res: any) => res.id !== id),
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create New Event" : "Edit Event"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <Input
                value={formData.eventName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    eventName: e.target.value,
                  }))
                }
                placeholder="Enter event name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date
                </label>
                <Input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      eventDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Event description..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={formData.locationId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, locationId: e.target.value }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Select a location</option>
              <option value="1">Main Auditorium (500 capacity)</option>
              <option value="2">Conference Room A (50 capacity)</option>
              <option value="3">Outdoor Plaza (1000 capacity)</option>
            </select>
          </CardContent>
        </Card>

        {/* Recurring Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Recurring Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isRecurring: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <label
                htmlFor="isRecurring"
                className="text-sm font-medium text-gray-700"
              >
                This is a recurring event
              </label>
            </div>

            {formData.isRecurring && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recurrence Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.recurStartDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        recurStartDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recurrence End Date
                  </label>
                  <Input
                    type="date"
                    value={formData.recurEndDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        recurEndDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Organizers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Organizers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.organizers.map((org: any) => (
                <Badge
                  key={org.id}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  {org.name} ({org.role})
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeOrganizer(org.id)}
                  />
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Organizer name"
                value={newOrganizer.name}
                onChange={(e) =>
                  setNewOrganizer((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                placeholder="Role"
                value={newOrganizer.role}
                onChange={(e) =>
                  setNewOrganizer((prev) => ({ ...prev, role: e.target.value }))
                }
              />
              <Button type="button" onClick={addOrganizer} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "create" ? "Create Event" : "Update Event"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { EventForm };
