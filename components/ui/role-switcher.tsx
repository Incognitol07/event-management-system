"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { useAuth, UserRole, User } from "@/lib/auth-context";
import { Settings, User as UserIcon } from "lucide-react";

const demoUsers: User[] = [
  {
    id: "1",
    name: "Dr. Sarah Admin",
    email: "admin@university.edu",
    role: "admin",
  },
  {
    id: "2",
    name: "Mike Organizer",
    email: "organizer@university.edu",
    role: "organizer",
  },
  {
    id: "3",
    name: "Jane Student",
    email: "student@university.edu",
    role: "attendee",
  },
];

export function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, login } = useAuth();

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "organizer":
        return "bg-blue-100 text-blue-700";
      case "attendee":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleUserSwitch = (newUser: User) => {
    login(newUser);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Settings className="w-4 h-4" />
        Switch Role (Demo)
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Switch User Role (Demo)
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            This is for demonstration purposes. In a real application, users
            would log in normally.
          </p>

          <div className="space-y-3">
            {demoUsers.map((demoUser) => (
              <div
                key={demoUser.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  user?.id === demoUser.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleUserSwitch(demoUser)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{demoUser.name}</div>
                      <div className="text-sm text-gray-500">
                        {demoUser.email}
                      </div>
                    </div>
                  </div>
                  <Badge className={getRoleBadgeColor(demoUser.role)}>
                    {demoUser.role.charAt(0).toUpperCase() +
                      demoUser.role.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
