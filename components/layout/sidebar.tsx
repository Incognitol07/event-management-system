"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, MapPin, Settings, Plus, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Attendees", href: "/attendees", icon: Users },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Settings", href: "/settings", icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EventFlow</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
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
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export { Sidebar };
