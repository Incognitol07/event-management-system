"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-1 h-1 bg-gray-900 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Compact header with clear branding */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="text-sm font-medium text-gray-900 tracking-wide">
          University Event Management
        </div>
      </header>

      {/* Centered content - compact but clear */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-lg">
          {/* Focused headline - large but not overwhelming */}
          <h1 className="text-9xl font-light text-gray-900 tracking-tight mb-4">
            Events
          </h1>

          {/* Clear value proposition */}
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            Streamlined scheduling and venue management for university events.
            Simple, efficient, purposeful.
          </p>

          {/* Clear action */}
          <Link
            href="/login"
            className="inline-block bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Simple footer */}
      <footer className="px-6 py-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          Designed for clarity and efficiency
        </div>
      </footer>
    </div>
  );
}
