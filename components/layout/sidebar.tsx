"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Users,
  MapPin,
  Settings,
  Plus,
  Home,
  CalendarDays,
  MessageSquare,
  Building,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth, UserRole } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  roles: UserRole[];
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "organizer", "attendee"],
  },
  {
    name: "Events",
    href: "/events",
    icon: Calendar,
    roles: ["admin", "organizer", "attendee"],
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
    roles: ["admin", "organizer", "attendee"],
  },
  {
    name: "Attendees",
    href: "/attendees",
    icon: Users,
    roles: ["admin", "organizer"],
  },
  {
    name: "Locations",
    href: "/locations",
    icon: MapPin,
    roles: ["admin", "organizer"],
  },
  {
    name: "Feedback",
    href: "/feedback",
    icon: MessageSquare,
    roles: ["admin", "organizer"],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "organizer", "attendee"],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout, hasRole } = useAuth();

  const filteredNavigation = navigation.filter((item) => hasRole(item.roles));

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

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        <Link href="/">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EventFlow</span>
            </div>
          </div>
        </Link>

        {/* User Profile Section */}
        {user && (
          <div className="px-3 py-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Badge className={cn("text-xs", getRoleBadgeColor(user.role))}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium transition-all",
                          isActive
                            ? "bg-gray-50 text-blue-600"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0 transition-colors",
                            isActive
                              ? "text-blue-600"
                              : "text-gray-400 group-hover:text-blue-600"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="mt-auto">
              {hasRole(["admin", "organizer"]) && (
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export { Sidebar };
