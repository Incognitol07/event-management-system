"use client";

import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";

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

  const approveAllPending = async () => {
    const pendingAllocations = existingAllocations.filter(
      (allocation) => allocation.status === "PENDING"
    );

    try {
      const approvalPromises = pendingAllocations.map((allocation) =>
        fetch(
          `/api/events/${eventId}/resources/${allocation.resourceId}/approve`,
          {
            method: "PUT",
          }
        )
      );

      await Promise.all(approvalPromises);
      onResourceAllocated(); // Refresh the allocations
    } catch (error) {
      console.error("Error approving allocations:", error);
      alert("Failed to approve some allocations");
    }
  };
  const denyAllocation = async (resourceId: number) => {
    try {
      const response = await fetch(
        `/api/events/${eventId}/resources/${resourceId}`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        onResourceAllocated();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to deny allocation");
      }
    } catch (error) {
      console.error("Error denying allocation:", error);
      alert("Failed to deny allocation");
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
    <div className="space-y-8">
      {/* Section header */}
      <div className="border-b border-gray-100 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-light text-gray-900">
              Resource Management
            </h3>
            <p className="text-gray-600 mt-1">
              Allocate resources needed for this event
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group inline-flex items-center px-6 py-2 text-sm font-medium text-gray-900 border border-gray-200 bg-transparent transition-all duration-300 hover:border-gray-900 hover:shadow-sm"
          >
            <span className="transition-colors duration-300 group-hover:text-gray-900">
              Add Resource
            </span>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      {resources.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCategoryFilter("")}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              categoryFilter === ""
                ? "text-gray-900 border-b border-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                categoryFilter === category
                  ? "text-gray-900 border-b border-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {categoryDisplayNames[category]}
            </button>
          ))}
        </div>
      )}

      {/* Existing Allocations */}
      {existingAllocations.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">
            Allocated Resources
          </h4>
          <div className="space-y-3">
            {existingAllocations.map((allocation) => (
              <div
                key={allocation.id}
                className="border border-gray-100 p-6 hover:border-gray-200 transition-colors"
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

      {/* Available Resources */}
      {resources.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">
            Available Resources
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => {
              const allocation = getResourceAllocation(resource.id);
              const isAllocated = !!allocation;

              return (
                <div
                  key={resource.id}
                  className={`border border-gray-100 p-6 transition-all duration-200 hover:border-gray-200 ${
                    isAllocated ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
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
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {resource.description}
                        </p>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Total: {resource.totalCount}
                        </span>
                        <span
                          className={
                            resource.availableCount > 0
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          Available: {resource.availableCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    {isAllocated ? (
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-medium px-3 py-1 border rounded-full ${getStatusColor(
                            allocation.status
                          )}`}
                        >
                          Allocated ({allocation.quantityNeeded}) -{" "}
                          {allocation.status}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedResource(resource);
                          setQuantity(1);
                          setNotes("");
                          setIsModalOpen(true);
                        }}
                        disabled={resource.availableCount === 0}
                        className={`w-full py-2 text-sm font-medium transition-colors ${
                          resource.availableCount === 0
                            ? "text-gray-400 border border-gray-200 cursor-not-allowed"
                            : "text-gray-700 border border-gray-200 hover:border-gray-900 hover:text-gray-900"
                        }`}
                      >
                        {resource.availableCount === 0
                          ? "Unavailable"
                          : "Allocate"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg font-light">
            No resources available.
          </div>
        </div>
      )}

      {/* Allocation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedResource(null);
          setQuantity(1);
          setNotes("");
        }}
        title=""
      >
        {selectedResource && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gray-900 mb-2">
                Allocate Resource
              </h2>
              <p className="text-gray-600">Request allocation for this event</p>
            </div>

            <div className="bg-gray-50 p-6 mb-8">
              <h4 className="font-medium text-gray-900 mb-2">
                {selectedResource.name}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {selectedResource.description}
              </p>
              <div className="text-sm">
                <span className="text-gray-500">Available: </span>
                <span className="font-medium">
                  {selectedResource.availableCount} of{" "}
                  {selectedResource.totalCount}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Needed
                </label>
                <input
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
                  className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors resize-none"
                  rows={3}
                  placeholder="Additional notes about this resource allocation..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedResource(null);
                    setQuantity(1);
                    setNotes("");
                  }}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAllocateResource}
                  disabled={
                    isLoading || quantity > selectedResource.availableCount
                  }
                  className="flex-1 px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Allocating..." : "Allocate"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
