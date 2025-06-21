"use client";

import { useState, useEffect } from "react";

interface ResourceAllocation {
  id: number;
  resourceId: number;
  quantityNeeded: number;
  status: string;
  notes?: string;
  resource: {
    id: number;
    name: string;
    description?: string;
    category: string;
    totalCount: number;
  };
}

interface ResourceViewProps {
  eventId: number;
  isOrganizer: boolean;
}

export function ResourceView({ eventId, isOrganizer }: ResourceViewProps) {
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([]);

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
    fetchAllocations();
  }, [eventId]);

  const fetchAllocations = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/resources`);
      const data = await response.json();
      setAllocations(data);
    } catch (error) {
      console.error("Error fetching resource allocations:", error);
    }
  };

  if (allocations.length === 0) {
    return null; // Don't show section if no resources allocated
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-xl font-medium text-gray-900">
          Resource Allocations
        </h3>
        <p className="text-gray-600 mt-1">Resources requested for this event</p>
      </div>

      <div className="space-y-4">
        {allocations.map((allocation) => (
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
                <div className="text-sm text-gray-600 mb-3">
                  Quantity requested: {allocation.quantityNeeded}
                </div>
                {allocation.resource.description && (
                  <div className="text-sm text-gray-500 mb-3">
                    {allocation.resource.description}
                  </div>
                )}
                {allocation.notes && (
                  <div className="text-sm text-gray-500 italic">
                    Note: {allocation.notes}
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

            {allocation.status === "PENDING" && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div className="text-sm text-yellow-700">
                  This resource request is pending admin approval.
                </div>
              </div>
            )}

            {allocation.status === "DENIED" && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <div className="text-sm text-red-700">
                  This resource request has been denied.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isOrganizer && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <div className="text-sm text-gray-600">
            To request additional resources for this event, please contact an
            administrator.
          </div>
        </div>
      )}
    </div>
  );
}
