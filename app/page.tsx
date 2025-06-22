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
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Subtle grid pattern for mathematical harmony */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      ></div>{" "}
      {/* Floating header with breathing space */}
      <header className="relative z-10 px-4 sm:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-medium text-gray-500 tracking-[0.15em] sm:tracking-[0.2em] uppercase cursor-default transform transition-all duration-700 hover:tracking-[0.25em] sm:hover:tracking-[0.4em] hover:text-gray-700">
            University Event Management
          </div>
        </div>
      </header>{" "}
      {/* Hero section with golden ratio proportions */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 relative">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Main headline with intentional typography */}
          <div className="mb-12 sm:mb-16 group cursor-default">
            <h1
              className="
                text-6xl sm:text-8xl md:text-9xl lg:text-[8.5rem]
                font-extralight text-gray-900 tracking-tighter leading-none mb-4 sm:mb-6
                transform transition-all duration-1000
                group-hover:scale-[1.02] sm:group-hover:scale-[1.05] group-hover:tracking-[-0.02em]
              "
            >
              Events
            </h1>

            {/* Subtle accent line with perfect timing */}
            <div
              className="
                relative h-px w-24 sm:w-32 md:w-40 mx-auto bg-gray-900
                transform origin-center transition-all duration-1200
                group-hover:w-32 sm:group-hover:w-40 md:group-hover:w-56 group-hover:bg-gray-600
              "
            >
              <div
                className="
                  absolute top-0 left-1/2 w-1 h-1 bg-gray-900 rounded-full
                  transform -translate-x-1/2 -translate-y-1/2
                  transition-all duration-800 group-hover:scale-150
                "
              ></div>
            </div>
          </div>

          {/* Refined copy with breathing room */}
          <div className="mb-12 sm:mb-16 max-w-xl mx-auto px-4">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-light tracking-wide">
              Where intention meets occasion.
              <br />
              <span className="text-gray-500">
                Every moment, thoughtfully crafted.
              </span>
            </p>
          </div>

          {/* Elevated button with perfect proportions */}
          <div className="group">
            <Link
              href="/login"
              className="group relative inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 text-sm font-medium text-gray-900 border border-gray-900 bg-transparent transition-all duration-500 hover:bg-gray-900 hover:shadow-2xl hover:shadow-gray-900/20 hover:-translate-y-1 active:scale-95 touch-manipulation"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Begin
              </span>

              {/* Subtle fill animation */}
              <div className="absolute inset-0 bg-gray-900 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>

              {/* Micro-interaction dots */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-900 rounded-full opacity-0 transform scale-0 transition-all duration-300 delay-200 group-hover:opacity-100 group-hover:scale-100"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gray-900 rounded-full opacity-0 transform scale-0 transition-all duration-300 delay-300 group-hover:opacity-100 group-hover:scale-100"></div>
            </Link>
          </div>
        </div>
      </div>{" "}
      {/* Minimal footer with perfect spacing */}
      <footer className="relative z-10 px-4 sm:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-xs text-gray-400 tracking-[0.15em] cursor-default transform transition-all duration-500 hover:text-gray-600 hover:tracking-[0.25em]">
            Crafted with intention
          </div>
        </div>
      </footer>
    </div>
  );
}
