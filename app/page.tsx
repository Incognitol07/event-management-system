import { EventCalendar } from "@/components/calendar/event-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthStatus } from "@/components/auth/auth-status";
import {
  Calendar,
  Users,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                EventFlow
              </span>
            </div>
            <AuthStatus />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
              University Event Management
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Streamline Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Campus Events
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The complete solution for managing university events, from
              planning to feedback. Organize seamlessly, engage students, and
              create memorable experiences.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="px-8">
                  Start Managing Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" size="lg" className="px-8">
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage events
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From event creation to attendee feedback, EventFlow provides all
              the tools you need to run successful campus events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent calendar management with conflict detection and
                  resource optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Attendee Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Easy registration, check-in, and communication with event
                  attendees.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Venue Coordination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage locations, resources, and capacity with real-time
                  availability.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Feedback System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Collect and analyze feedback to continuously improve your
                  events.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Instant notifications and updates keep everyone informed and
                  engaged.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Role-based Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Secure, role-based permissions ensure the right people have
                  the right access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="px-6 lg:px-8 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Campus Events at a Glance
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay up to date with all upcoming events, register with one click,
              and never miss what matters to you.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <EventCalendar />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Events Managed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25K+</div>
              <div className="text-gray-600">Attendees Registered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Campus Locations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-8 py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your event management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of organizers who trust EventFlow to deliver
            exceptional campus experiences.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="px-8">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-12 bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EventFlow</span>
            </div>
            <p className="text-gray-400">
              © 2025 EventFlow. Built for universities, by universities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
