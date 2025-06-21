"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

interface Resource {
  id: number;
  name: string;
  description?: string;
  category: string;
  totalCount: number;
  availableCount: number;
  allocatedCount: number;
  isActive: boolean;
}

interface ResourceAllocation {
  id: number;
  resourceId: number;
  quantityNeeded: number;
  status: string;
  notes?: string;
  resource: Resource;
}

interface ResourceSelectorProps {
  eventId: number;
  eventDate: string;
  onResourceAllocated: () => void;
  existingAllocations: ResourceAllocation[];
}

export function ResourceSelector({
  eventId,
  eventDate,
  onResourceAllocated,
  existingAllocations,
}: ResourceSelectorProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const categories = [
    "AUDIO_VISUAL",
    "FURNITURE",
    "TECHNICAL_STAFF",
    "CATERING",
    "TRANSPORTATION",
    "SECURITY",
    "OTHER",
  ];

  const categoryDisplayNames: { [key: string]: string } = {
    AUDIO_VISUAL: "Audio/Visual",
    FURNITURE: "Furniture",
    TECHNICAL_STAFF: "Technical Staff",
    CATERING: "Catering",
    TRANSPORTATION: "Transportation",
    SECURITY: "Security",
    OTHER: "Other",
  };

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    DENIED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  useEffect(() => {
    fetchResources();
  }, [categoryFilter]);

  const fetchResources = async () => {
    try {
      const url = categoryFilter
        ? `/api/resources?category=${categoryFilter}&active=true`
        : "/api/resources?active=true";

      const response = await fetch(url);
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const handleAllocateResource = async () => {
    if (!selectedResource) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resourceId: selectedResource.id,
          quantityNeeded: quantity,
          notes,
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setSelectedResource(null);
        setQuantity(1);
        setNotes("");
        onResourceAllocated();
        fetchResources(); // Refresh to update availability
      } else {
        const error = await response.json();
        alert(error.error || "Failed to allocate resource");
      }
    } catch (error) {
      console.error("Error allocating resource:", error);
      alert("Failed to allocate resource");
    } finally {
      setIsLoading(false);
    }
  };

  const isResourceAllocated = (resourceId: number) => {
    return existingAllocations.some(
      (allocation) => allocation.resourceId === resourceId
    );
  };

  const getResourceAllocation = (resourceId: number) => {
    return existingAllocations.find(
      (allocation) => allocation.resourceId === resourceId
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Resource Management</h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Resource
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoryFilter === "" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("")}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(category)}
          >
            {categoryDisplayNames[category]}
          </Button>
        ))}
      </div>

      {/* Existing Allocations */}
      {existingAllocations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Allocated Resources</h4>
          {existingAllocations.map((allocation) => (
            <Card key={allocation.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium">{allocation.resource.name}</h5>
                  <p className="text-sm text-gray-600">
                    Quantity: {allocation.quantityNeeded} /{" "}
                    {allocation.resource.totalCount}
                  </p>
                  {allocation.notes && (
                    <p className="text-sm text-gray-500 mt-1">
                      {allocation.notes}
                    </p>
                  )}
                </div>
                <Badge
                  className={
                    statusColors[allocation.status as keyof typeof statusColors]
                  }
                >
                  {allocation.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Available Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => {
          const allocation = getResourceAllocation(resource.id);
          const isAllocated = !!allocation;

          return (
            <Card
              key={resource.id}
              className={`p-4 ${isAllocated ? "opacity-75" : ""}`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{resource.name}</h4>
                  <Badge variant="outline">
                    {categoryDisplayNames[resource.category]}
                  </Badge>
                </div>

                {resource.description && (
                  <p className="text-sm text-gray-600">
                    {resource.description}
                  </p>
                )}

                <div className="flex justify-between text-sm">
                  <span>Total: {resource.totalCount}</span>
                  <span
                    className={
                      resource.availableCount > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    Available: {resource.availableCount}
                  </span>
                </div>

                {isAllocated ? (
                  <Badge
                    className={
                      statusColors[
                        allocation.status as keyof typeof statusColors
                      ]
                    }
                  >
                    Allocated ({allocation.quantityNeeded}) -{" "}
                    {allocation.status}
                  </Badge>
                ) : (
                  <Button
                    onClick={() => {
                      setSelectedResource(resource);
                      setIsModalOpen(true);
                    }}
                    disabled={resource.availableCount === 0}
                    size="sm"
                    className="w-full"
                  >
                    {resource.availableCount === 0 ? "Unavailable" : "Allocate"}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Allocation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedResource(null);
          setQuantity(1);
          setNotes("");
        }}
        title="Allocate Resource"
      >
        {selectedResource && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">{selectedResource.name}</h4>
              <p className="text-sm text-gray-600">
                {selectedResource.description}
              </p>
              <p className="text-sm">
                Available: {selectedResource.availableCount} /{" "}
                {selectedResource.totalCount}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Quantity Needed
              </label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(
                      1,
                      Math.min(
                        parseInt(e.target.value) || 1,
                        selectedResource.availableCount
                      )
                    )
                  )
                }
                min="1"
                max={selectedResource.availableCount}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Additional notes about this resource allocation..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedResource(null);
                  setQuantity(1);
                  setNotes("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAllocateResource}
                disabled={
                  isLoading || quantity > selectedResource.availableCount
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Allocating..." : "Allocate Resource"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
