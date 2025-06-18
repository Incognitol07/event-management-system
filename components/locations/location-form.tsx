"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";

interface LocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (locationData: any) => void;
  initialData?: any;
  mode: "create" | "edit";
}

const LocationForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: LocationFormProps) => {
  const [formData, setFormData] = useState({
    locationName: initialData?.locationName || "",
    capacity: initialData?.capacity || "",
    description: initialData?.description || "",
    facilities: initialData?.facilities || ([] as string[]),
    address: initialData?.address || "",
    contactPerson: initialData?.contactPerson || "",
    contactPhone: initialData?.contactPhone || "",
  });

  const [newFacility, setNewFacility] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      capacity: parseInt(formData.capacity.toString()),
    };
    onSubmit(submitData);
    onClose();
  };

  const addFacility = () => {
    if (newFacility.trim()) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()],
      }));
      setNewFacility("");
    }
  };
  const removeFacility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_: string, i: number) => i !== index),
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add New Location" : "Edit Location"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Name *
              </label>
              <Input
                value={formData.locationName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    locationName: e.target.value,
                  }))
                }
                placeholder="e.g., Main Auditorium, Conference Room A"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      capacity: e.target.value,
                    }))
                  }
                  placeholder="Maximum number of people"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactPerson: e.target.value,
                    }))
                  }
                  placeholder="Person in charge"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Building and room number or address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <Input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactPhone: e.target.value,
                  }))
                }
                placeholder="Contact phone number"
              />
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
                placeholder="Brief description of the location..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Facilities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Available Facilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {" "}
            <div className="flex flex-wrap gap-2">
              {formData.facilities.map((facility: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {facility}
                  <button
                    type="button"
                    onClick={() => removeFacility(index)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Projector, Microphone, WiFi"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFacility();
                  }
                }}
              />
              <Button type="button" onClick={addFacility} variant="outline">
                Add
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Add facilities and equipment available at this location
            </p>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "create" ? "Add Location" : "Update Location"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { LocationForm };
