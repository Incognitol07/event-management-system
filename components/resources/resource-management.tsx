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
  createdAt: string;
  updatedAt: string;
}

interface EventResourceAllocation {
  id: number;
  eventId: number;
  resourceId: number;
  quantityNeeded: number;
  status: string;
  notes?: string;
  createdAt: string;
  event: {
    id: number;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: {
      name: string;
    };
    createdBy: {
      name: string;
    };
  };
}

export function ResourceManagement() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [allocations, setAllocations] = useState<EventResourceAllocation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  // New resource form
  const [newResource, setNewResource] = useState({
    name: "",
    description: "",
    category: "AUDIO_VISUAL",
    totalCount: 1,
  });

  // Edit resource form
  const [editResource, setEditResource] = useState({
    id: 0,
    name: "",
    description: "",
    category: "AUDIO_VISUAL",
    totalCount: 1,
    isActive: true,
  });

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

  useEffect(() => {
    fetchResources();
  }, [categoryFilter]);

  const fetchResources = async () => {
    try {
      const url = categoryFilter
        ? `/api/resources?category=${categoryFilter}`
        : "/api/resources";

      const response = await fetch(url);
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const fetchResourceDetails = async (resourceId: number) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`);
      const data = await response.json();
      setSelectedResource(data);
      setAllocations(data.eventResources || []);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching resource details:", error);
    }
  };
  const createResource = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newResource),
      });

      if (response.ok) {
        setIsCreateModalOpen(false);
        setNewResource({
          name: "",
          description: "",
          category: "AUDIO_VISUAL",
          totalCount: 1,
        });
        fetchResources();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create resource");
      }
    } catch (error) {
      console.error("Error creating resource:", error);
      alert("Failed to create resource");
    } finally {
      setIsLoading(false);
    }
  };

  const updateResource = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/resources/${editResource.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editResource.name,
          description: editResource.description,
          category: editResource.category,
          totalCount: editResource.totalCount,
          isActive: editResource.isActive,
        }),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        fetchResources();
        // If we're viewing this resource, refresh the details
        if (selectedResource && selectedResource.id === editResource.id) {
          fetchResourceDetails(editResource.id);
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update resource");
      }
    } catch (error) {
      console.error("Error updating resource:", error);
      alert("Failed to update resource");
    } finally {
      setIsLoading(false);
    }
  };
  const deleteResource = async (resourceId: number) => {
    const resource = resources.find((r) => r.id === resourceId);

    // Check if resource has active allocations before showing confirmation
    if (resource && resource.allocatedCount > 0) {
      alert(
        `Cannot delete this resource. It is currently allocated to ${resource.allocatedCount} upcoming events. Please wait for the events to complete or reassign the resource allocations first.`
      );
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this resource? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchResources();
        // Close modal if we're viewing the deleted resource
        if (selectedResource && selectedResource.id === resourceId) {
          setIsModalOpen(false);
          setSelectedResource(null);
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete resource");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource");
    }
  };
  const openEditModal = (resource: Resource) => {
    setEditResource({
      id: resource.id,
      name: resource.name,
      description: resource.description || "",
      category: resource.category,
      totalCount: resource.totalCount,
      isActive: resource.isActive,
    });
    setIsEditModalOpen(true);
  };

  const approveAllocation = async (eventId: number, resourceId: number) => {
    try {
      const response = await fetch(
        `/api/events/${eventId}/resources/${resourceId}/approve`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        // Refresh resource details
        if (selectedResource) {
          fetchResourceDetails(selectedResource.id);
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to approve allocation");
      }
    } catch (error) {
      console.error("Error approving allocation:", error);
      alert("Failed to approve allocation");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-4">
              Resources
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Manage and allocate campus resources with precision.
            </p>

            {/* Create new resource button */}
            <div className="mt-8">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="group inline-flex items-center px-8 py-3 text-sm font-medium text-gray-900 border border-gray-900 bg-transparent transition-all duration-300 hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white tracking-wide">
                  Add Resource
                </span>
                <div className="absolute inset-0 bg-gray-900 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Category filters */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setCategoryFilter("")}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                categoryFilter === ""
                  ? "text-gray-900 border-b-2 border-gray-900"
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
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {categoryDisplayNames[category]}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Resources grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {resources.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg font-light">
              No resources found.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {" "}
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="group bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="p-8">
                  {/* Category tag */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                        resource.category
                      )}`}
                    >
                      {categoryDisplayNames[resource.category]}
                    </span>
                  </div>

                  {/* Resource name */}
                  <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {resource.name}
                  </h3>

                  {/* Description */}
                  {resource.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                      {resource.description}
                    </p>
                  )}

                  {/* Availability indicator */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Total</span>
                      <span className="font-medium text-gray-900">
                        {resource.totalCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Available</span>
                      <span
                        className={`font-medium ${
                          resource.availableCount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {resource.availableCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">In Use</span>
                      <span className="font-medium text-gray-900">
                        {resource.allocatedCount}
                      </span>
                    </div>
                  </div>

                  {/* Status indicator and actions */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          resource.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {resource.isActive ? "Active" : "Inactive"}
                      </span>
                      <button
                        onClick={() => fetchResourceDetails(resource.id)}
                        className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors hover:underline"
                      >
                        View Details →
                      </button>
                    </div>

                    {/* Admin action buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(resource);
                        }}
                        className="flex-1 px-3 py-2 text-xs border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-all duration-200"
                      >
                        Edit
                      </button>{" "}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteResource(resource.id);
                        }}
                        disabled={resource.allocatedCount > 0}
                        className={`flex-1 px-3 py-2 text-xs border transition-all duration-200 ${
                          resource.allocatedCount > 0
                            ? "border-gray-200 text-gray-400 cursor-not-allowed"
                            : "border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                        }`}
                        title={
                          resource.allocatedCount > 0
                            ? "Cannot delete: Resource is currently allocated to events"
                            : "Delete resource"
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Resource Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedResource(null);
          setAllocations([]);
        }}
        title=""
      >
        {selectedResource && (
          <div className="max-w-2xl mx-auto">
            {" "}
            {/* Modal header */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center gap-4 mb-4">
                <h2 className="text-3xl font-light text-gray-900">
                  {selectedResource.name}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(selectedResource)}
                    className="px-4 py-2 text-sm border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-all duration-200"
                  >
                    Edit
                  </button>{" "}
                  <button
                    onClick={() => deleteResource(selectedResource.id)}
                    disabled={selectedResource.allocatedCount > 0}
                    className={`px-4 py-2 text-sm border transition-all duration-200 ${
                      selectedResource.allocatedCount > 0
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                    }`}
                    title={
                      selectedResource.allocatedCount > 0
                        ? "Cannot delete: Resource is currently allocated to events"
                        : "Delete resource"
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{selectedResource.description}</p>
            </div>
            {/* Resource overview */}
            <div className="bg-gray-50 p-6 mb-8">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-light text-gray-900">
                    {selectedResource.totalCount}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Total</div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-light ${
                      selectedResource.availableCount > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedResource.availableCount}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Available</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-gray-900">
                    {selectedResource.allocatedCount}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Allocated</div>
                </div>
              </div>
            </div>
            {/* Current allocations */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Current Allocations
              </h3>
              {allocations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No current allocations
                </div>
              ) : (
                <div className="space-y-4">
                  {allocations.map((allocation) => (
                    <div
                      key={allocation.id}
                      className="border border-gray-100 p-4 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {allocation.event.title}
                          </h4>
                          <div className="text-sm text-gray-600 mt-1">
                            {formatDate(allocation.event.date)} •{" "}
                            {allocation.event.venue.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            by {allocation.event.createdBy.name}
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium px-3 py-1 border rounded-full ${getStatusColor(
                            allocation.status
                          )}`}
                        >
                          {allocation.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Quantity:{" "}
                          <span className="font-medium">
                            {allocation.quantityNeeded}
                          </span>
                        </span>

                        {allocation.status === "PENDING" && (
                          <button
                            onClick={() =>
                              approveAllocation(
                                allocation.eventId,
                                allocation.resourceId
                              )
                            }
                            className="text-sm px-4 py-1 bg-green-600 text-white hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                      </div>

                      {allocation.notes && (
                        <div className="text-sm text-gray-500 mt-2 italic">
                          {allocation.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>{" "}
      {/* Create Resource Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewResource({
            name: "",
            description: "",
            category: "AUDIO_VISUAL",
            totalCount: 1,
          });
        }}
        title=""
      >
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-2">
              New Resource
            </h2>
            <p className="text-gray-600">Add a new resource to the system</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Name
              </label>
              <input
                type="text"
                value={newResource.name}
                onChange={(e) =>
                  setNewResource({ ...newResource, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
                placeholder="e.g., HD Projector"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newResource.category}
                onChange={(e) =>
                  setNewResource({ ...newResource, category: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryDisplayNames[category]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Count
              </label>
              <input
                type="number"
                value={newResource.totalCount}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    totalCount: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                min="1"
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newResource.description}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="Brief description of the resource..."
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewResource({
                    name: "",
                    description: "",
                    category: "AUDIO_VISUAL",
                    totalCount: 1,
                  });
                }}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createResource}
                disabled={isLoading || !newResource.name.trim()}
                className="flex-1 px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Edit Resource Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditResource({
            id: 0,
            name: "",
            description: "",
            category: "AUDIO_VISUAL",
            totalCount: 1,
            isActive: true,
          });
        }}
        title=""
      >
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-2">
              Edit Resource
            </h2>
            <p className="text-gray-600">Update resource information</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Name
              </label>
              <input
                type="text"
                value={editResource.name}
                onChange={(e) =>
                  setEditResource({ ...editResource, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
                placeholder="e.g., HD Projector"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={editResource.category}
                onChange={(e) =>
                  setEditResource({ ...editResource, category: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryDisplayNames[category]}
                  </option>
                ))}
              </select>
            </div>{" "}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Count
              </label>
              {(() => {
                const currentResource = resources.find(
                  (r) => r.id === editResource.id
                );
                const minAllowed = currentResource?.allocatedCount || 0;
                return (
                  <div>
                    <input
                      type="number"
                      value={editResource.totalCount}
                      onChange={(e) => {
                        const newValue = Math.max(
                          minAllowed,
                          parseInt(e.target.value) || minAllowed
                        );
                        setEditResource({
                          ...editResource,
                          totalCount: newValue,
                        });
                      }}
                      min={minAllowed}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
                    />
                    {minAllowed > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum allowed: {minAllowed} (currently allocated to
                        events)
                      </p>
                    )}
                    {currentResource && (
                      <div className="mt-2 text-xs text-gray-600">
                        Currently allocated: {currentResource.allocatedCount} •
                        Available: {currentResource.availableCount}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={editResource.isActive ? "active" : "inactive"}
                onChange={(e) =>
                  setEditResource({
                    ...editResource,
                    isActive: e.target.value === "active",
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editResource.description}
                onChange={(e) =>
                  setEditResource({
                    ...editResource,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="Brief description of the resource..."
              />
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditResource({
                    id: 0,
                    name: "",
                    description: "",
                    category: "AUDIO_VISUAL",
                    totalCount: 1,
                    isActive: true,
                  });
                }}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateResource}
                disabled={isLoading || !editResource.name.trim()}
                className="flex-1 px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
