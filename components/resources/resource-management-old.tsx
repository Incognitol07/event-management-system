"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";

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
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // New resource form
  const [newResource, setNewResource] = useState({
    name: "",
    description: "",
    category: "AUDIO_VISUAL",
    totalCount: 1,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resource Management</h2>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add New Resource
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

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{resource.name}</h3>
                <Badge variant="outline">
                  {categoryDisplayNames[resource.category]}
                </Badge>
              </div>

              {resource.description && (
                <p className="text-sm text-gray-600">{resource.description}</p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Count:</span>
                  <span className="font-medium">{resource.totalCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Available:</span>
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
                <div className="flex justify-between text-sm">
                  <span>Allocated:</span>
                  <span className="font-medium">{resource.allocatedCount}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Badge
                  className={
                    resource.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {resource.isActive ? "Active" : "Inactive"}
                </Badge>
                <Button
                  onClick={() => fetchResourceDetails(resource.id)}
                  size="sm"
                  variant="outline"
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Resource Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedResource(null);
          setAllocations([]);
        }}
        title={
          selectedResource
            ? `${selectedResource.name} - Allocations`
            : "Resource Details"
        }
      >
        {selectedResource && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium">{selectedResource.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {selectedResource.description}
              </p>
              <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-2 font-medium">
                    {selectedResource.totalCount}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Available:</span>
                  <span
                    className={`ml-2 font-medium ${
                      selectedResource.availableCount > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedResource.availableCount}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Allocated:</span>
                  <span className="ml-2 font-medium">
                    {selectedResource.allocatedCount}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-3">Current Allocations</h5>
              {allocations.length === 0 ? (
                <p className="text-gray-500 text-sm">No current allocations</p>
              ) : (
                <div className="space-y-3">
                  {allocations.map((allocation) => (
                    <Card key={allocation.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h6 className="font-medium">
                              {allocation.event.title}
                            </h6>
                            <p className="text-sm text-gray-600">
                              {formatDate(allocation.event.date)} at{" "}
                              {allocation.event.venue.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Organized by {allocation.event.createdBy.name}
                            </p>
                          </div>
                          <Badge
                            className={
                              statusColors[
                                allocation.status as keyof typeof statusColors
                              ]
                            }
                          >
                            {allocation.status}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            Quantity:{" "}
                            <span className="font-medium">
                              {allocation.quantityNeeded}
                            </span>
                          </span>

                          {allocation.status === "PENDING" && (
                            <Button
                              onClick={() =>
                                approveAllocation(
                                  allocation.eventId,
                                  allocation.resourceId
                                )
                              }
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                          )}
                        </div>

                        {allocation.notes && (
                          <p className="text-sm text-gray-500 italic">
                            {allocation.notes}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

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
        title="Add New Resource"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Resource Name
            </label>
            <Input
              value={newResource.name}
              onChange={(e) =>
                setNewResource({ ...newResource, name: e.target.value })
              }
              placeholder="e.g., Projector, Conference Table, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={newResource.category}
              onChange={(e) =>
                setNewResource({ ...newResource, category: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryDisplayNames[category]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Total Count
            </label>
            <Input
              type="number"
              value={newResource.totalCount}
              onChange={(e) =>
                setNewResource({
                  ...newResource,
                  totalCount: Math.max(1, parseInt(e.target.value) || 1),
                })
              }
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              value={newResource.description}
              onChange={(e) =>
                setNewResource({ ...newResource, description: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Brief description of the resource..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewResource({
                  name: "",
                  description: "",
                  category: "AUDIO_VISUAL",
                  totalCount: 1,
                });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={createResource}
              disabled={isLoading || !newResource.name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Creating..." : "Create Resource"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
