"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const success = await login(email);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Invalid email");
    }
    setIsLoading(false);
  };

  const demoAccounts = [
    { email: "admin@university.edu", role: "Admin" },
    { email: "coordinator@university.edu", role: "Staff" },
    { email: "alice@university.edu", role: "Student" },
    { email: "bob@university.edu", role: "Student" },
  ];
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {" "}
      {/* Animated header */}
      <header className="px-6 py-4 border-b border-gray-100 group">
        <Link href="/">
          <div className="text-sm font-medium text-gray-900 tracking-wide transition-all duration-500 group-hover:tracking-[0.3em] cursor-default">
            University Event Management
          </div>
        </Link>
      </header>
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {" "}
          {/* Welcoming heading with personality */}
          <div className="text-center mb-8 group">
            <h1 className="text-3xl font-light text-gray-900 mb-2 transition-all duration-300 group-hover:scale-105 cursor-default">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-600">
              Ready to create something amazing?
              <span className="inline-block ml-1 transition-transform duration-300 hover:rotate-12 hover:scale-110">
                🎯
              </span>
            </p>
          </div>
          {/* Compact form with delightful interactions */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div className="group">
              <input
                type="email"
                required
                className="w-full text-base py-3 px-4 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 group-hover:border-gray-400"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-sm font-medium py-3 bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 hover:scale-105 hover:shadow-lg"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>{" "}
          {/* Demo accounts with personality */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">
              Demo Accounts
              <span className="inline-block ml-1 text-xs opacity-60">
                Try one!
              </span>
            </h2>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => setEmail(account.email)}
                  className="w-full text-left py-2 px-3 hover:bg-gray-50 transition-all duration-300 border border-gray-100 text-sm hover:scale-105 hover:shadow-sm group"
                >
                  <div className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                    {account.email}
                  </div>
                  <div className="text-gray-600 text-xs">{account.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
