"use client";

import { useState } from "react";
import { Menu, Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleSwitcher } from "@/components/ui/role-switcher";

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-lg px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {title && (
            <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
              {title}
            </h1>
          )}
        </div>

        <div className="flex flex-1 justify-end items-center gap-x-4 lg:gap-x-6">
          {/* Search */}
          <div className="flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 pl-3" />
              <Input
                className="pl-10"
                placeholder="Search events, attendees..."
                type="search"
              />
            </div>
          </div>{" "}
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>
          {/* Role Switcher for Demo */}
          <RoleSwitcher />
          {/* Profile */}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { Header };
