"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Calendar, Users, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Event Management
                <span className="text-indigo-600 block">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Streamline university event scheduling with our intuitive
                platform. From proposal to approval, manage every event with
                ease and efficiency.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                Learn More
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600">Events Managed</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  50+
                </div>
                <div className="text-gray-600">Venues Available</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  1500+
                </div>
                <div className="text-gray-600">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for university event management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Calendar
              </h3>
              <p className="text-gray-600">
                Visualize all events in one centralized calendar with conflict
                detection and priority management.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Approval Workflow
              </h3>
              <p className="text-gray-600">
                Streamlined approval process with memo requirements and
                role-based permissions.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Venue Management
              </h3>
              <p className="text-gray-600">
                Automatic conflict detection ensures no double-bookings and
                optimal venue utilization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join hundreds of users already managing their events efficiently
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 transition-colors shadow-lg"
          >
            Sign In Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-indigo-400 mr-2" />
              <span className="text-lg font-semibold">
                Event Management System
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Streamlining university events with modern technology
            </p>
            <div className="text-sm text-gray-500">
              © 2025 University Event Management System. Built for efficiency.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
