"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

export function AuthStatus() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="outline">Sign In</Button>
        </Link>
        <Link href="/dashboard?demo=admin">
          <Button>Try Demo</Button>
        </Link>
      </div>
    );
  }

  const getRoleBadgeColor = (role: string) => {
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
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
        <div className="text-sm">
          <div className="font-medium">{user?.name}</div>
          <Badge className={getRoleBadgeColor(user?.role || "")}>
            {user?.role}
          </Badge>
        </div>
      </div>
      <Link href="/dashboard">
        <Button variant="outline">Dashboard</Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={logout}>
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}
