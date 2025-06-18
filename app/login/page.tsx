"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth, User, UserRole } from "@/lib/auth-context";
import {
  Calendar,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
} from "lucide-react";

const presetUsers: User[] = [
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, find user by email
    const user = presetUsers.find((u) => u.email === email);
    if (user) {
      login(user);
      router.push("/dashboard");
    } else {
      alert("User not found. Please use one of the preset accounts.");
    }

    setIsLoading(false);
  };

  const handleQuickLogin = (user: User) => {
    login(user);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">EventFlow</span>
          </div>
          <p className="text-gray-600">
            Sign in to access your university event management system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Quick Login Options */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Demo Access
              </CardTitle>
              <p className="text-sm text-gray-600 text-center">
                Quick login with different user roles
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {presetUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-blue-300"
                  onClick={() => handleQuickLogin(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Role Permissions:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    <strong>Admin:</strong> Full system access
                  </li>
                  <li>
                    <strong>Organizer:</strong> Event management & attendees
                  </li>
                  <li>
                    <strong>Attendee:</strong> View events & register
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
