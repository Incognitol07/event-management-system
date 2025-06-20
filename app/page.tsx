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
      {" "}
      {/* Subtle animated header */}
      <header className="px-6 py-4 border-b border-gray-100 group">
        <div className="text-sm font-medium text-gray-900 tracking-wide transition-all duration-500 group-hover:tracking-[0.3em] cursor-default">
          University Event Management
        </div>
      </header>
      {/* Centered content - compact but clear */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-lg">
          {/* Playful headline with subtle magic */}
          <div className="mb-6 group cursor-default">
            <h1 className="text-6xl font-light text-gray-900 tracking-tight transition-all duration-500 group-hover:scale-105 group-hover:text-gray-700">
              Events
            </h1>
            <div className="h-0.5 w-0 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 mx-auto mt-3 transition-all duration-1000 group-hover:w-20"></div>
          </div>

          {/* Warm, personality-filled copy */}
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            Where great ideas meet perfect timing. Because every moment matters.
            <span className="inline-block ml-2 text-lg transition-transform duration-300 hover:rotate-12 hover:scale-110">
              ✨
            </span>
          </p>

          {/* Delightful button with micro-interactions */}
          <Link
            href="/login"
            className="group relative inline-block bg-gray-900 text-white px-8 py-3 text-sm font-medium overflow-hidden transition-all duration-300 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
          >
            <span className="relative z-10 transition-all duration-300 group-hover:tracking-widest">
              Get Started
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-500 group-hover:w-full"></div>
          </Link>
        </div>
      </div>
      {/* Poetic footer with hover surprise */}
      <footer className="px-6 py-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center hover:text-gray-700 transition-all duration-500 cursor-default group">
          <span className="transition-all duration-300 group-hover:tracking-wider">
            Designed for clarity, built for joy
          </span>
          <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-12">
            ✦
          </span>
        </div>
      </footer>
    </div>
  );
}
