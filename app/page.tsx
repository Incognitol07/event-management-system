"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSpring, animated, useSpringValue } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
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
  Clock,
  TrendingUp,
  Activity,
  Heart,
  Coffee,
  Music,
  BookOpen,
  Lightbulb,
  Sparkles,
  Eye,
  Target,
  Flame,
  MessageSquare,
  Settings,
  BarChart3,
  UserPlus,
  Search,
  Filter,
  Bell,
  Share2,
  Award,
  Megaphone,
} from "lucide-react";
import Link from "next/link";

// Enhanced mock data with more realistic campus events
const mockEvents = [
  {
    id: 1,
    title: "AI & Machine Learning Symposium",
    date: new Date("2025-07-15"),
    time: "09:00",
    location: "Main Auditorium",
    attendees: 342,
    capacity: 500,
    category: "Technology",
    color: "bg-gradient-to-br from-blue-500 to-purple-600",
    icon: Lightbulb,
    trending: true,
    tags: ["AI", "Research", "Innovation"]
  },
  {
    id: 2,
    title: "Campus Coffee & Networking",
    date: new Date("2025-06-20"),
    time: "14:00",
    location: "Student Center",
    attendees: 89,
    capacity: 120,
    category: "Social",
    color: "bg-gradient-to-br from-amber-500 to-orange-600",
    icon: Coffee,
    trending: false,
    tags: ["Networking", "Social", "Casual"]
  },
  {
    id: 3,
    title: "Spring Music Festival",
    date: new Date("2025-06-25"),
    time: "18:00",
    location: "Outdoor Plaza",
    attendees: 756,
    capacity: 1000,
    category: "Entertainment",
    color: "bg-gradient-to-br from-pink-500 to-red-600",
    icon: Music,
    trending: true,
    tags: ["Music", "Festival", "Arts"]
  },
  {
    id: 4,
    title: "Entrepreneurship Workshop",
    date: new Date("2025-06-22"),
    time: "13:00",
    location: "Business Hall",
    attendees: 45,
    capacity: 80,
    category: "Business",
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    icon: TrendingUp,
    trending: false,
    tags: ["Business", "Startup", "Workshop"]
  },
  {
    id: 5,
    title: "Study Group: Finals Prep",
    date: new Date("2025-06-21"),
    time: "10:00",
    location: "Library Study Room",
    attendees: 23,
    capacity: 30,
    category: "Academic",
    color: "bg-gradient-to-br from-indigo-500 to-blue-600",
    icon: BookOpen,
    trending: false,
    tags: ["Study", "Academic", "Finals"]
  }
];

// Real-time stats that update
const useRealtimeStats = () => {
  const [stats, setStats] = useState({
    activeEvents: 12,
    liveAttendees: 1247,
    campusEnergy: 85,
    trending: "AI Symposium"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        liveAttendees: prev.liveAttendees + Math.floor(Math.random() * 3 - 1),
        campusEnergy: Math.max(70, Math.min(100, prev.campusEnergy + Math.floor(Math.random() * 6 - 3))),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return stats;
};

// Event type definition
interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  attendees: number;
  capacity: number;
  category: string;
  color: string;
  icon: React.ComponentType<any>;
  trending: boolean;
  tags: string[];
}

// Floating event cards animation
const FloatingEventCard = ({ event, index, isVisible }: { event: Event; index: number; isVisible: boolean }) => {
  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { tension: 300, friction: 30 }
  }));

  const bind = useDrag(({ offset: [ox, oy], down }) => {
    api.start({
      x: down ? ox : 0,
      y: down ? oy : 0,
      scale: down ? 1.1 : 1,
    });
  });

  const floatAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-10px)' });
        await next({ transform: 'translateY(0px)' });
      }
    },
    config: { duration: 2000 + index * 500 },
  });

  const Icon = event.icon;

  return (
    <animated.div
      {...bind()}
      className={`
        absolute rounded-2xl p-4 text-white shadow-2xl backdrop-blur-sm
        ${event.color} 
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        transition-all duration-1000
        hover:shadow-3xl transform hover:scale-105
      `}
      style={{
        left: `${10 + index * 18}%`,
        top: `${20 + (index % 2) * 40}%`,
        width: '280px',
        x,
        y,
        scale,
        ...floatAnimation,
        touchAction: 'none',
        cursor: 'grab',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium">{event.category}</span>
        </div>
        {event.trending && (
          <Badge className="bg-white/20 text-white border-white/30">
            <Flame className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        )}
      </div>
      
      <h3 className="font-bold text-lg mb-2 leading-tight">{event.title}</h3>
      
      <div className="space-y-1 text-sm text-white/90">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{event.time} • {event.date.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{event.attendees}/{event.capacity} attending</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 2).map((tag: string, i: number) => (
              <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <Heart className="w-3 h-3" />
            </button>
            <button className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
              <Share2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 w-full bg-white/20 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-white rounded-full h-2 transition-all duration-1000 animate-shimmer"
          style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
        />
      </div>

      {/* Quick action buttons */}
      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1">
          <UserPlus className="w-4 h-4" />
          Register
        </button>
        <button className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive buttons */}
      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1">
          <UserPlus className="w-4 h-4" />
          Register
        </button>
        <button className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center">
          <Share2 className="w-4 h-4" />
        </button>
        <button className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center">
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </animated.div>
  );
};

// Campus pulse visualization
const CampusPulse = ({ energy }: { energy: number }) => {
  const pulseSpring = useSpring({
    from: { scale: 1, opacity: 0.3 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.2, opacity: 0.8 });
        await next({ scale: 1, opacity: 0.3 });
      }
    },
    config: { duration: 2000 }
  });

  return (
    <div className="relative w-32 h-32 mx-auto">
      <animated.div
        style={pulseSpring}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
      />
      <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {energy}%
          </div>
          <div className="text-xs text-gray-600">Campus Energy</div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const stats = useRealtimeStats();

  // Intersection observers for scroll animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [pulseRef, pulseInView] = useInView({ threshold: 0.3 });
  const [eventsRef, eventsInView] = useInView({ threshold: 0.2 });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    setIsHeroVisible(heroInView);
  }, [heroInView]);

  // Hero section animation
  const heroSpring = useSpring({
    opacity: heroInView ? 1 : 0,
    transform: heroInView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 280, friction: 120 }
  });

  // Stats counter animation
  const statsSpring = useSpring({
    number: pulseInView ? stats.liveAttendees : 0,
    config: { duration: 2000 }
  });

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Dynamic gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,119,198,0.1),transparent)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.1),transparent)] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-8 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">EventFlow</span>
              </div>
              
              {/* Live stats in header */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="font-medium">{stats.activeEvents} live</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <animated.span className="font-medium">
                    {statsSpring.number.to(n => Math.floor(n).toLocaleString())}
                  </animated.span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="font-medium">{stats.campusEnergy}% energy</span>
                </div>
              </div>

              <AuthStatus />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Campus Pulse Experience */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-6 lg:px-8 min-h-screen flex items-center">
        <div className="mx-auto max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <animated.div style={heroSpring} className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none px-4 py-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Your Complete Event Universe
                </Badge>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  One Platform,
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">
                    Every Event
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  View • Register • Organize • Feedback • Analytics
                  <br />
                  <span className="font-semibold text-gray-800">
                    The only event platform your university needs.
                  </span>
                </p>

                {/* Feature highlights */}
                <div className="flex flex-wrap gap-3 py-4">
                  {[
                    { icon: Eye, text: "Discover Events", color: "bg-blue-100 text-blue-700" },
                    { icon: UserPlus, text: "Easy Registration", color: "bg-green-100 text-green-700" },
                    { icon: Megaphone, text: "Organize & Promote", color: "bg-purple-100 text-purple-700" },
                    { icon: MessageSquare, text: "Share Feedback", color: "bg-orange-100 text-orange-700" },
                    { icon: BarChart3, text: "Track Analytics", color: "bg-pink-100 text-pink-700" }
                  ].map((feature, index) => (
                    <Badge key={index} className={`${feature.color} border-none px-3 py-2 text-sm font-medium`}>
                      <feature.icon className="w-4 h-4 mr-2" />
                      {feature.text}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <Target className="w-5 h-5 mr-2" />
                    Jump Into Action
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 transform hover:scale-105 transition-all duration-300">
                    <Eye className="w-5 h-5 mr-2" />
                    Explore Events
                  </Button>
                </Link>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    <animated.span>
                      {statsSpring.number.to(n => Math.floor(n / 10))}
                    </animated.span>
                  </div>
                  <div className="text-sm text-gray-600">Events Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    <animated.span>
                      {statsSpring.number.to(n => Math.floor(n).toLocaleString())}
                    </animated.span>
                  </div>
                  <div className="text-sm text-gray-600">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </animated.div>

            {/* Right Column - Interactive Campus Pulse */}
            <div className="relative">
              <div ref={pulseRef} className="relative h-96 lg:h-[500px]">
                {/* Campus Energy Pulse */}
                <div className="absolute top-8 right-8 z-20">
                  <CampusPulse energy={stats.campusEnergy} />
                </div>

                {/* Floating Event Cards */}
                {mockEvents.map((event, index) => (
                  <FloatingEventCard
                    key={event.id}
                    event={event}
                    index={index}
                    isVisible={pulseInView}
                  />
                ))}

                {/* Interactive hint */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-gray-600 shadow-lg">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Drag the events to explore!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Grid */}
      <section ref={featuresRef} className="px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Your Complete Event Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for university events in one powerful platform. 
              From discovery to analytics, we've got every aspect covered.
            </p>
          </div>

          {/* Main feature categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* For Students */}
            <animated.div
              style={{
                opacity: featuresInView ? 1 : 0,
                transform: featuresInView ? 'translateY(0px)' : 'translateY(30px)',
                transition: 'all 0.6s ease-out'
              }}
            >
              <Card className="h-full border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-blue-50 to-white overflow-hidden group">
                <CardHeader className="pb-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-900 mb-2">For Students</CardTitle>
                  <p className="text-blue-700">Discover • Register • Attend</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Search, text: "Smart Event Discovery" },
                    { icon: Filter, text: "Personalized Recommendations" },
                    { icon: UserPlus, text: "One-Click Registration" },
                    { icon: Bell, text: "Real-time Notifications" },
                    { icon: Calendar, text: "Personal Event Calendar" },
                    { icon: MessageSquare, text: "Event Feedback & Reviews" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                      <feature.icon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </animated.div>

            {/* For Organizers */}
            <animated.div
              style={{
                opacity: featuresInView ? 1 : 0,
                transform: featuresInView ? 'translateY(0px)' : 'translateY(30px)',
                transition: 'all 0.6s ease-out 200ms'
              }}
            >
              <Card className="h-full border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-purple-50 to-white overflow-hidden group">
                <CardHeader className="pb-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Megaphone className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-purple-900 mb-2">For Organizers</CardTitle>
                  <p className="text-purple-700">Create • Manage • Promote</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Calendar, text: "Event Creation & Scheduling" },
                    { icon: MapPin, text: "Venue & Resource Management" },
                    { icon: Users, text: "Attendee Management" },
                    { icon: Megaphone, text: "Promotion & Marketing Tools" },
                    { icon: BarChart3, text: "Live Event Analytics" },
                    { icon: MessageSquare, text: "Feedback Collection" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                      <feature.icon className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </animated.div>

            {/* For Administrators */}
            <animated.div
              style={{
                opacity: featuresInView ? 1 : 0,
                transform: featuresInView ? 'translateY(0px)' : 'translateY(30px)',
                transition: 'all 0.6s ease-out 400ms'
              }}
            >
              <Card className="h-full border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-green-50 to-white overflow-hidden group">
                <CardHeader className="pb-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-900 mb-2">For Admins</CardTitle>
                  <p className="text-green-700">Oversee • Control • Analyze</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Settings, text: "System Administration" },
                    { icon: Users, text: "User & Role Management" },
                    { icon: MapPin, text: "Campus Resource Control" },
                    { icon: BarChart3, text: "University-wide Analytics" },
                    { icon: Shield, text: "Security & Compliance" },
                    { icon: Award, text: "Performance Monitoring" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-100 transition-colors duration-200">
                      <feature.icon className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </animated.div>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Instant search, real-time updates, blazing performance.",
                color: "from-yellow-400 to-orange-500",
                delay: 0
              },
              {
                icon: Heart,
                title: "User-Centric",
                description: "Designed with students and organizers in mind.",
                color: "from-pink-400 to-red-500",
                delay: 200
              },
              {
                icon: Target,
                title: "All-in-One",
                description: "Every feature you need, nothing you don't.",
                color: "from-blue-400 to-purple-500",
                delay: 400
              },
              {
                icon: Award,
                title: "University Proven",
                description: "Trusted by campuses nationwide for reliability.",
                color: "from-green-400 to-emerald-500",
                delay: 600
              }
            ].map((benefit, index) => (
              <animated.div
                key={index}
                style={{
                  opacity: featuresInView ? 1 : 0,
                  transform: featuresInView ? 'translateY(0px)' : 'translateY(30px)',
                  transition: `all 0.6s ease-out ${benefit.delay + 800}ms`
                }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-gray-50 overflow-hidden group">
                  <CardHeader className="pb-4 text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              </animated.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-8 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Revolutionize Your Campus Events?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join the universities already using EventFlow as their complete event solution. 
            <br />
            <span className="font-semibold">One platform. Every event. Unlimited possibilities.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Target className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-gray-900 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Eye className="w-5 h-5 mr-2" />
                Explore Live Events
              </Button>
            </Link>
          </div>

          {/* Enhanced stats with more context */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 mr-2" />
                <span className="text-3xl font-bold">500+</span>
              </div>
              <div className="text-white/80">Events Managed Monthly</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 mr-2" />
                <span className="text-3xl font-bold">25K+</span>
              </div>
              <div className="text-white/80">Active Students</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6 mr-2" />
                <span className="text-3xl font-bold">50+</span>
              </div>
              <div className="text-white/80">Campus Locations</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 mr-2" />
                <span className="text-3xl font-bold">98%</span>
              </div>
              <div className="text-white/80">Satisfaction Rate</div>
            </div>
          </div>

          {/* Value propositions */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Eye className="w-8 h-8 mx-auto mb-2 text-blue-200" />
              <h4 className="font-semibold text-white mb-1">Discover</h4>
              <p className="text-white/80 text-sm">Find events tailored to your interests</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Megaphone className="w-8 h-8 mx-auto mb-2 text-purple-200" />
              <h4 className="font-semibold text-white mb-1">Organize</h4>
              <p className="text-white/80 text-sm">Create and manage events effortlessly</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-pink-200" />
              <h4 className="font-semibold text-white mb-1">Analyze</h4>
              <p className="text-white/80 text-sm">Track success with detailed insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-12 bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EventFlow</span>
            </div>
            <p className="text-gray-400 text-center">
              © 2025 EventFlow. Connecting campus communities, one event at a time.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-400">
                <Activity className="w-4 h-4" />
                <span className="text-sm">System Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
