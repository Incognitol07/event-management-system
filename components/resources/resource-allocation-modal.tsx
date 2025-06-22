"use client";

import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { useAuth } from "@/lib/auth-context";

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

interface ResourceAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  eventDate: string;
  onResourceAllocated: () => void;
  existingAllocations: ResourceAllocation[];
}

export function ResourceAllocationModal({
  isOpen,
  onClose,
  eventId,
  eventDate,
  onResourceAllocated,
  existingAllocations,
}: ResourceAllocationModalProps) {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
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

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-50 text-yellow-600 border-yellow-200",
      APPROVED: "bg-green-50 text-green-600 border-green-200",
      DENIED: "bg-red-50 text-red-600 border-red-200",
      CANCELLED: "bg-gray-50 text-gray-600 border-gray-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-50 text-gray-600 border-gray-200"
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      AUDIO_VISUAL: "bg-blue-50 text-blue-600",
      FURNITURE: "bg-green-50 text-green-600",
      TECHNICAL_STAFF: "bg-purple-50 text-purple-600",
      CATERING: "bg-orange-50 text-orange-600",
      TRANSPORTATION: "bg-indigo-50 text-indigo-600",
      SECURITY: "bg-red-50 text-red-600",
      OTHER: "bg-gray-50 text-gray-600",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-50 text-gray-600"
    );
  };

  const fetchResources = async () => {
    try {
      const response = await fetch(
        `/api/resources?date=${eventDate}&active=true`
      );
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
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
          "x-user-id": user?.id?.toString() || "",
        },
        body: JSON.stringify({
          resourceId: selectedResource.id,
          quantityNeeded: quantity,
          notes,
        }),
      });

      if (response.ok) {
        setIsAllocateModalOpen(false);
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

  const filteredResources = resources.filter((resource) => {
    if (categoryFilter && resource.category !== categoryFilter) return false;

    // Don't show already allocated resources
    const isAllocated = existingAllocations.some(
      (allocation) => allocation.resourceId === resource.id
    );
    return !isAllocated && resource.availableCount > 0;
  });

  useEffect(() => {
    if (isOpen) {
      fetchResources();
    }
  }, [isOpen, eventDate]);

  return (
    <>
      {/* Main Resource Allocation Modal */}{" "}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Resource Management"
        size="xl"
      >
        <div className="p-6 space-y-6">
          {/* Existing Allocations */}
          {existingAllocations.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">
                Current Resource Allocations
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {existingAllocations.map((allocation) => (
                  <div
                    key={allocation.id}
                    className="border border-gray-100 p-4 rounded-lg hover:border-gray-200 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="font-medium text-gray-900">
                            {allocation.resource.name}
                          </h5>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(
                              allocation.resource.category
                            )}`}
                          >
                            {categoryDisplayNames[allocation.resource.category]}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Quantity: {allocation.quantityNeeded} of{" "}
                          {allocation.resource.totalCount}
                        </div>
                        {allocation.notes && (
                          <div className="text-sm text-gray-500 mt-2 italic">
                            {allocation.notes}
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium px-3 py-1 border rounded-full ${getStatusColor(
                          allocation.status
                        )}`}
                      >
                        {allocation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Add New Resources
            </h4>
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setCategoryFilter("")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                  categoryFilter === ""
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    categoryFilter === category
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {categoryDisplayNames[category]}
                </button>
              ))}
            </div>
          </div>

          {/* Available Resources */}
          <div className="space-y-4">
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="border border-gray-100 p-4 rounded-lg hover:border-gray-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium text-gray-900">
                            {resource.name}
                          </h5>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(
                              resource.category
                            )}`}
                          >
                            {categoryDisplayNames[resource.category]}
                          </span>
                        </div>
                        {resource.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {resource.description}
                          </p>
                        )}
                        <div className="text-sm text-gray-500">
                          Available: {resource.availableCount} of{" "}
                          {resource.totalCount}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedResource(resource);
                        setQuantity(1);
                        setNotes("");
                        setIsAllocateModalOpen(true);
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 bg-transparent transition-all duration-200 hover:border-gray-900 hover:shadow-sm rounded-lg"
                    >
                      Allocate Resource
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  {categoryFilter
                    ? `No available resources in ${categoryDisplayNames[categoryFilter]} category`
                    : "No available resources to allocate"}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
      {/* Resource Allocation Detail Modal */}
      <Modal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        title={`Allocate ${selectedResource?.name}`}
        size="md"
      >
        {selectedResource && (
          <div className="p-6 space-y-6">
            <div className="border border-gray-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h5 className="font-medium text-gray-900">
                  {selectedResource.name}
                </h5>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(
                    selectedResource.category
                  )}`}
                >
                  {categoryDisplayNames[selectedResource.category]}
                </span>
              </div>
              {selectedResource.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {selectedResource.description}
                </p>
              )}
              <div className="text-sm text-gray-500">
                Available: {selectedResource.availableCount} of{" "}
                {selectedResource.totalCount}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Needed
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedResource.availableCount}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Add any special notes or requirements..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsAllocateModalOpen(false)}
                className="flex-1 px-6 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAllocateResource}
                disabled={
                  isLoading || quantity > selectedResource.availableCount
                }
                className="flex-1 px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Allocating..." : "Allocate Resource"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
