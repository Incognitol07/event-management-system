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
  isActive: boolean;
}

interface ResourceRequest {
  resourceId: number;
  quantityNeeded: number;
  notes?: string;
}

interface EventResourceRequestProps {
  eventDate: string;
  resourceRequests: ResourceRequest[];
  onAddRequest: (request: ResourceRequest) => void;
  onRemoveRequest: (resourceId: number) => void;
  onUpdateRequest: (
    resourceId: number,
    updates: Partial<ResourceRequest>
  ) => void;
}

export function EventResourceRequest({
  eventDate,
  resourceRequests,
  onAddRequest,
  onRemoveRequest,
  onUpdateRequest,
}: EventResourceRequestProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { key: "all", label: "All Resources" },
    { key: "AUDIO_VISUAL", label: "Audio/Visual" },
    { key: "FURNITURE", label: "Furniture" },
    { key: "TECHNICAL_STAFF", label: "Technical Staff" },
    { key: "CATERING", label: "Catering" },
    { key: "TRANSPORTATION", label: "Transportation" },
    { key: "SECURITY", label: "Security" },
    { key: "OTHER", label: "Other" },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      AUDIO_VISUAL: "bg-blue-100 text-blue-800",
      FURNITURE: "bg-green-100 text-green-800",
      TECHNICAL_STAFF: "bg-purple-100 text-purple-800",
      CATERING: "bg-orange-100 text-orange-800",
      TRANSPORTATION: "bg-indigo-100 text-indigo-800",
      SECURITY: "bg-red-100 text-red-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchResources();
    }
  }, [isModalOpen]);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources?active=true");
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isResourceRequested = (resourceId: number) => {
    return resourceRequests.some(req => req.resourceId === resourceId);
  };

  const getRequestedQuantity = (resourceId: number) => {
    const request = resourceRequests.find(req => req.resourceId === resourceId);
    return request?.quantityNeeded || 0;
  };

  const handleQuantityChange = (resourceId: number, quantity: number) => {
    if (quantity <= 0) {
      onRemoveRequest(resourceId);
    } else {
      const existingRequest = resourceRequests.find(req => req.resourceId === resourceId);
      if (existingRequest) {
        onUpdateRequest(resourceId, { quantityNeeded: quantity });
      } else {
        onAddRequest({ resourceId, quantityNeeded: quantity });
      }
    }
  };

  const getResourceName = (resourceId: number) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource?.name || "Unknown Resource";
  };

  return (
    <>
      {/* Summary display in the form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Resources</h3>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-md hover:border-gray-400 transition-all duration-200"
          >
            {resourceRequests.length > 0 ? 'Manage Resources' : 'Request Resources'}
          </button>
        </div>

        {resourceRequests.length > 0 ? (
          <div className="space-y-2">
            {resourceRequests.map((request) => (
              <div key={request.resourceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{getResourceName(request.resourceId)}</div>
                  <div className="text-sm text-gray-600">Quantity: {request.quantityNeeded}</div>
                  {request.notes && (
                    <div className="text-sm text-gray-500 italic">{request.notes}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveRequest(request.resourceId)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-gray-400 text-4xl mb-2">📦</div>
            <p className="text-gray-500 text-sm">No resources requested yet</p>
            <p className="text-gray-400 text-xs">Click "Request Resources" to add equipment, staff, or services</p>
          </div>
        )}
      </div>

      {/* Resource selection modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request Resources"
        size="lg"
      >
        <div className="space-y-6">
          {/* Search and filter */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                    selectedCategory === category.key
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resources grid */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {filteredResources.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No resources found matching your criteria
              </div>
            ) : (
              filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{resource.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(resource.category)}`}>
                          {categories.find(c => c.key === resource.category)?.label || resource.category}
                        </span>
                      </div>
                      
                      {resource.description && (
                        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                      )}
                      
                      <div className="text-sm text-gray-500">
                        Available: {resource.availableCount} of {resource.totalCount}
                      </div>
                    </div>

                    <div className="ml-4 flex items-center gap-2">
                      {isResourceRequested(resource.id) ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(resource.id, getRequestedQuantity(resource.id) - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">
                            {getRequestedQuantity(resource.id)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(resource.id, getRequestedQuantity(resource.id) + 1)}
                            disabled={getRequestedQuantity(resource.id) >= resource.availableCount}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(resource.id, 1)}
                          disabled={resource.availableCount === 0}
                          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {resource.availableCount === 0 ? 'Unavailable' : 'Add'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {resourceRequests.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Requested ({resourceRequests.length} {resourceRequests.length === 1 ? 'item' : 'items'})
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                {resourceRequests.map((request) => (
                  <div key={request.resourceId} className="flex justify-between">
                    <span>{getResourceName(request.resourceId)}</span>
                    <span>Qty: {request.quantityNeeded}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
