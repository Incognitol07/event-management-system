"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "@react-spring/web";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Shield,
  Activity,
  Sparkles,
  Eye,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

// Real-time stats that update (simplified for school use)
const useRealtimeStats = () => {
  const [stats, setStats] = useState({
    activeEvents: 8,
    totalStudents: 1450,
    upcomingEvents: 12,
  });

  return stats;
};

// Enlightening Event Showcase - Modern, clean card design with better visual hierarchy
const EventShowcase = () => {
  const featuredEvents = [
    {
      id: 1,
      title: "AI & Innovation Symposium",
      date: "Dec 15",
      time: "9:00 AM",
      location: "Tech Auditorium",
      attendees: 320,
      category: "Technology",
      status: "Registration Open",
      description:
        "Cutting-edge research presentations by faculty and industry leaders",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      icon: "🤖",
      priority: "featured",
    },
    {
      id: 2,
      title: "Town & Gown Forum",
      date: "Dec 18",
      time: "6:00 PM",
      location: "Community Center",
      attendees: 150,
      category: "Community",
      status: "Open to Public",
      description: "Bridging university and local community initiatives",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      icon: "🏛️",
      priority: "high",
    },
    {
      id: 3,
      title: "Tech Meetup: Web3 & Blockchain",
      date: "Dec 20",
      time: "7:00 PM",
      location: "Innovation Lab",
      attendees: 85,
      category: "Technology",
      status: "RSVP Required",
      description: "Student-led discussion on decentralized technologies",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      icon: "⛓️",
      priority: "high",
    },
    {
      id: 4,
      title: "Business Pitch Competition",
      date: "Jan 8",
      time: "2:00 PM",
      location: "Business School",
      attendees: 200,
      category: "Business",
      status: "Apply Now",
      description: "Present your startup ideas to VCs and industry experts",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      icon: "💡",
      priority: "medium",
    },
    {
      id: 5,
      title: "Research Symposium",
      date: "Jan 12",
      time: "10:00 AM",
      location: "Graduate Center",
      attendees: 180,
      category: "Academic",
      status: "Abstract Submission",
      description: "Undergraduate and graduate research presentations",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
      icon: "🔬",
      priority: "medium",
    },
    {
      id: 6,
      title: "Cultural Heritage Night",
      date: "Jan 15",
      time: "6:30 PM",
      location: "Student Union",
      attendees: 400,
      category: "Cultural",
      status: "Free Entry",
      description:
        "Celebrating diversity through food, music, and performances",
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700",
      icon: "�",
      priority: "high",
    },
    {
      id: 7,
      title: "Startup Incubator Demo Day",
      date: "Jan 20",
      time: "1:00 PM",
      location: "Entrepreneurship Center",
      attendees: 250,
      category: "Business",
      status: "Invitation Only",
      description: "Student startups showcase to investors and mentors",
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      icon: "�",
      priority: "featured",
    },
    {
      id: 8,
      title: "Philosophy Café",
      date: "Jan 22",
      time: "7:00 PM",
      location: "Library Lounge",
      attendees: 60,
      category: "Academic",
      status: "Walk-ins Welcome",
      description: "Informal discussions on ethics, consciousness, and society",
      color: "from-slate-500 to-gray-600",
      bgColor: "bg-slate-50",
      textColor: "text-slate-700",
      icon: "🤔",
      priority: "low",
    },
    {
      id: 9,
      title: "Hackathon 2025",
      date: "Feb 2",
      time: "6:00 PM",
      location: "Computer Science Building",
      attendees: 120,
      category: "Technology",
      status: "Team Registration",
      description: "24-hour coding challenge with prizes and mentorship",
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50",
      textColor: "text-violet-700",
      icon: "💻",
      priority: "high",
    },
    {
      id: 10,
      title: "Alumni Networking Mixer",
      date: "Feb 5",
      time: "5:30 PM",
      location: "Alumni Hall",
      attendees: 180,
      category: "Professional",
      status: "RSVP Required",
      description: "Connect with successful alumni across various industries",
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      icon: "🤝",
      priority: "medium",
    },
  ];

  return (
    <div className="relative">
      {/* Spotlight effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-transparent rounded-3xl"></div>

      {/* Main featured event (center large card) */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            What's Happening on Campus
          </h3>
          <p className="text-slate-600">
            Discover events that inspire, connect, and educate
          </p>
        </div>

        {/* Card showcase layout - improved positioning */}
        <div className="relative w-full max-w-6xl h-[500px] mx-auto">
          {featuredEvents.slice(0, 8).map((event, index) => {
            // Create a more dynamic and visually appealing arrangement
            const positions = [
              // Center featured card
              {
                left: "50%",
                top: "20%",
                transform: "translateX(-50%) scale(1.15)",
                zIndex: 25,
              },
              // Top left
              {
                left: "8%",
                top: "10%",
                transform: "rotate(-12deg) scale(0.9)",
                zIndex: 20,
              },
              // Top right
              {
                left: "78%",
                top: "15%",
                transform: "rotate(8deg) scale(0.9)",
                zIndex: 20,
              },
              // Middle left
              {
                left: "5%",
                top: "50%",
                transform: "rotate(-6deg) scale(0.85)",
                zIndex: 15,
              },
              // Middle right
              {
                left: "82%",
                top: "55%",
                transform: "rotate(10deg) scale(0.85)",
                zIndex: 15,
              },
              // Bottom left
              {
                left: "15%",
                top: "75%",
                transform: "rotate(-4deg) scale(0.8)",
                zIndex: 12,
              },
              // Bottom right
              {
                left: "70%",
                top: "78%",
                transform: "rotate(6deg) scale(0.8)",
                zIndex: 12,
              },
              // Additional card (slightly hidden behind others)
              {
                left: "45%",
                top: "65%",
                transform: "rotate(2deg) scale(0.75)",
                zIndex: 8,
              },
            ];

            const position = positions[index];
            const isFeatured = index === 0;
            const isHighPriority =
              event.priority === "high" || event.priority === "featured";

            return (
              <div
                key={event.id}
                className={`absolute transition-all duration-700 hover:scale-110 hover:z-30 cursor-pointer group ${
                  isFeatured ? "w-80" : "w-72"
                }`}
                style={{
                  left: position.left,
                  top: position.top,
                  transform: position.transform,
                  zIndex: position.zIndex,
                }}
              >
                <div
                  key={event.id}
                  className={`absolute transition-all duration-700 hover:scale-110 hover:z-30 cursor-pointer group ${
                    isFeatured ? "w-80" : "w-72"
                  }`}
                  style={{
                    left: position.left,
                    top: position.top,
                    transform: position.transform,
                    zIndex: position.zIndex,
                  }}
                >
                  <div
                    className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:border-blue-200 ${
                      isFeatured
                        ? "ring-2 ring-blue-500/30 shadow-blue-100"
                        : ""
                    } ${isHighPriority ? "shadow-lg" : "shadow-md"}`}
                  >
                    {/* Card header with gradient */}
                    <div
                      className={`h-3 bg-gradient-to-r ${event.color}`}
                    ></div>

                    <div className="p-5">
                      {/* Category and status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{event.icon}</span>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${event.bgColor} ${event.textColor}`}
                          >
                            {event.category}
                          </span>
                        </div>
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                          {event.status}
                        </span>
                      </div>

                      {/* Event title */}
                      <h4
                        className={`font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors ${
                          isFeatured ? "text-lg" : "text-base"
                        }`}
                      >
                        {event.title}
                      </h4>

                      {/* Event description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Event details */}
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4">📅</span>
                          <span>
                            {event.date} • {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4">📍</span>
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4">👥</span>
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        className={`w-full text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r ${
                          event.color
                        } hover:shadow-lg hover:scale-[1.02] ${
                          isFeatured ? "text-sm" : "text-xs"
                        }`}
                      >
                        {event.status === "Register Now"
                          ? "Register"
                          : event.status === "Apply Now"
                          ? "Apply"
                          : event.status === "RSVP Required"
                          ? "RSVP"
                          : "Learn More"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">
            Ready to discover more amazing events?
          </p>
          <Link href="/events">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Explore All Events
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const stats = useRealtimeStats();

  // Intersection observers for scroll animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [eventsRef, eventsInView] = useInView({ threshold: 0.2 });

  // Hero section animation
  const heroSpring = useSpring({
    opacity: heroInView ? 1 : 0,
    transform: heroInView ? "translateY(0px)" : "translateY(50px)",
    config: { tension: 280, friction: 120 },
  });

  // Stats counter animation
  const statsSpring = useSpring({
    number: eventsInView ? stats.totalStudents : 0,
    config: { duration: 2000 },
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      {/* Modern gradient background using brand colors */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-50 via-white to-purple-50 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.05),transparent)]" />
      </div>

      {/* Professional Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-8 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-900">
                    EventFlow
                  </span>
                  <div className="text-xs text-slate-500">
                    Campus Event Platform
                  </div>
                </div>
              </div>

              {/* Live activity indicators */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Activity className="w-4 h-4" />
                  <span className="font-medium">
                    {stats.activeEvents} live events
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sky-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">
                    <animated.span>
                      {statsSpring.number.to((n: number) =>
                        Math.floor(n).toLocaleString()
                      )}
                    </animated.span>{" "}
                    students
                  </span>
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {stats.upcomingEvents} upcoming events
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Clean and Professional */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 px-6 lg:px-8 min-h-screen flex items-center"
      >
        <div className="mx-auto max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <animated.div style={heroSpring} className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-sky-500 to-purple-600 text-white border-none px-4 py-2 text-sm font-medium shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  The Complete Event Management Solution
                </Badge>

                <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
                  Your Campus
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-purple-600 to-emerald-600">
                    Event Journey
                  </span>
                  <span className="text-4xl lg:text-5xl block mt-2">
                    Starts Here
                  </span>
                </h1>

                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  Discover amazing events, connect with your community, and
                  create unforgettable experiences. EventFlow makes campus life
                  more engaging and accessible for everyone.
                </p>

                {/* Value propositions */}
                <div className="grid grid-cols-2 gap-4 py-6">
                  {[
                    {
                      icon: Eye,
                      text: "Discover Events",
                      color: "text-sky-600",
                    },
                    {
                      icon: UserPlus,
                      text: "Join Instantly",
                      color: "text-emerald-600",
                    },
                    {
                      icon: Calendar,
                      text: "Never Miss Out",
                      color: "text-purple-600",
                    },
                    {
                      icon: Users,
                      text: "Connect & Engage",
                      color: "text-indigo-600",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 ${item.color} bg-opacity-10 rounded-lg flex items-center justify-center`}
                      >
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className="font-medium text-slate-700">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/events">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Explore Events
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold border-2 border-slate-300 hover:bg-slate-50 transform hover:scale-105 transition-all duration-300"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Join Community
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sky-600">50+</div>
                  <div className="text-sm text-slate-600">
                    Events This Month
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    <animated.span>
                      {statsSpring.number.to((n: number) =>
                        (Math.floor(n / 100) / 10).toFixed(1)
                      )}
                    </animated.span>
                    k
                  </div>
                  <div className="text-sm text-slate-600">
                    Students Connected
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">95%</div>
                  <div className="text-sm text-slate-600">Attendance Rate</div>
                </div>
              </div>
            </animated.div>

            {/* Right Column - Event Showcase */}
            <div className="relative">
              <div ref={eventsRef} className="relative">
                <EventShowcase />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="px-6 lg:px-8 py-12 bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">EventFlow</span>
                <div className="text-xs text-slate-400">
                  Campus Event Platform
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-center">
              © 2025 EventFlow. Empowering campus communities through seamless
              event management.
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">
                  All Systems Operational
                </span>
              </div>
              <div className="flex items-center gap-2 text-sky-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Secure & Reliable</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
