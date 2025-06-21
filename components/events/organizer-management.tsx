"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Organizer {
  id: number;
  userId: number;
  role: "PRIMARY_ORGANIZER" | "CO_ORGANIZER";
  addedAt: string;
  user: User;
}

interface OrganizerManagementProps {
  eventId: number;
  currentUserId: number;
  onOrganizerAdded?: () => void;
  onOrganizerRemoved?: () => void;
}

export default function OrganizerManagement({
  eventId,
  currentUserId,
  onOrganizerAdded,
  onOrganizerRemoved,
}: OrganizerManagementProps) {
  const { user } = useAuth();
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Check if current user can manage organizers (is primary organizer or admin)
  const canManageOrganizers = () => {
    const userOrganizer = organizers.find(
      (org) => org.userId === currentUserId
    );
    return (
      user?.role === "ADMIN" || userOrganizer?.role === "PRIMARY_ORGANIZER"
    );
  };

  // Fetch organizers
  const fetchOrganizers = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/organizers`);
      if (response.ok) {
        const data = await response.json();
        setOrganizers(data);
      }
    } catch (error) {
      console.error("Error fetching organizers:", error);
    }
  };

  // Search users
  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const users = await response.json();
        // Filter out users who are already organizers
        const existingOrganizerIds = organizers.map((org) => org.userId);
        const filteredUsers = users.filter(
          (user: User) => !existingOrganizerIds.includes(user.id)
        );
        setSearchResults(filteredUsers);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Add organizer
  const addOrganizer = async (userId: number) => {
    setIsAdding(true);
    setError("");

    try {
      const response = await fetch(`/api/events/${eventId}/organizers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          addedBy: currentUserId,
        }),
      });

      if (response.ok) {
        await fetchOrganizers();
        setSearchQuery("");
        setSearchResults([]);
        setShowAddForm(false);
        onOrganizerAdded?.();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add organizer");
      }
    } catch (error) {
      console.error("Error adding organizer:", error);
      setError("Failed to add organizer");
    } finally {
      setIsAdding(false);
    }
  };

  // Remove organizer
  const removeOrganizer = async (userId: number) => {
    if (!confirm("Are you sure you want to remove this organizer?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/events/${eventId}/organizers?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchOrganizers();
        onOrganizerRemoved?.();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to remove organizer");
      }
    } catch (error) {
      console.error("Error removing organizer:", error);
      setError("Failed to remove organizer");
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, [eventId]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, organizers]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 tracking-tight">
          Organizers
        </h3>
        {canManageOrganizers() && (
            <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="group relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 bg-transparent rounded-xl transition-all duration-300 hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 active:scale-95"
            >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    {showAddForm ? "Cancel" : "Add Co-Organizer"}
                </span>
                <div
                    className="absolute inset-0 bg-gray-900 rounded-xl transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
                />
            </button>
        )}
      </div>

      {/* Current Organizers */}
      <div className="space-y-3">
        {organizers.map((organizer) => (
          <div
            key={organizer.id}
            className="group relative bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="font-medium text-gray-900 transition-colors duration-300 group-hover:text-gray-700">
                    {organizer.user.name}
                  </div>
                  {organizer.role === "PRIMARY_ORGANIZER" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 transition-all duration-300 group-hover:bg-gray-900 group-hover:text-white">
                      Primary
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 transition-all duration-300 group-hover:bg-gray-100">
                      Co-Organizer
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
                  {organizer.user.email}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider transition-colors duration-300 group-hover:text-gray-500">
                  {organizer.user.role}
                </div>
              </div>
              {canManageOrganizers() && organizer.role === "CO_ORGANIZER" && (
                <button
                  onClick={() => removeOrganizer(organizer.userId)}
                  className="ml-4 text-gray-400 hover:text-red-600 transition-all duration-300 hover:scale-110 focus:outline-none"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Organizer Form */}
      {showAddForm && canManageOrganizers() && (
        <div className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-500 transform">
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 opacity-[0.01]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="relative p-6">
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 tracking-tight mb-2">
                Add Co-Organizer
              </h4>
              <p className="text-sm text-gray-500">
                Search for users with organizer permissions to collaborate on
                this event.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-red-700 font-medium">
                    {error}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-900 mb-3 transition-all duration-300 group-hover:text-gray-700">
                  Search for users
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type name or email to search..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-[1.01] placeholder-gray-400"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-top-gray-900 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Results */}
              {searchQuery.length >= 2 && (
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  {isSearching ? (
                    <div className="p-8 text-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-top-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
                      <div className="text-sm text-gray-500">
                        Searching for users...
                      </div>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-8 text-center">
                      <svg
                        className="w-8 h-8 text-gray-300 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m6-4v2m2-2v2m-6 2v2m2-2v2"
                        />
                      </svg>
                      <div className="text-sm text-gray-500">
                        No users found
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Try a different search term
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      {searchResults.map((user, index) => (
                        <div
                          key={user.id}
                          className={`group flex items-center justify-between p-4 transition-all duration-300 hover:bg-gray-50 ${
                            index !== searchResults.length - 1
                              ? "border-b border-gray-50"
                              : ""
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 transition-colors duration-300 group-hover:text-gray-700">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider transition-colors duration-300 group-hover:text-gray-500">
                              {user.role}
                            </div>
                          </div>
                          <button
                            onClick={() => addOrganizer(user.id)}
                            disabled={isAdding}
                            className="ml-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 bg-transparent rounded-xl transition-all duration-300 hover:bg-gray-900 hover:text-white hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-900 disabled:hover:translate-y-0"
                          >
                            <span className="relative z-10 transition-colors duration-300">
                              {isAdding ? "Adding..." : "Add"}
                            </span>
                            <div className="absolute inset-0 bg-gray-900 rounded-xl transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {searchQuery.length < 2 && searchQuery.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <div className="text-sm text-gray-500">
                    Type at least 2 characters to search
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
