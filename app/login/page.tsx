"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

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
      {/* Compact header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="text-sm font-medium text-gray-900 tracking-wide">
          University Event Management
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Focused heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-2">Sign In</h1>
            <p className="text-sm text-gray-600">
              Access your event management dashboard
            </p>
          </div>

          {/* Compact form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div>
              <input
                type="email"
                required
                className="w-full text-base py-3 px-4 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-sm font-medium py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo accounts - compact but informative */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">
              Demo Accounts
            </h2>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => setEmail(account.email)}
                  className="w-full text-left py-2 px-3 hover:bg-gray-50 transition-colors border border-gray-100 text-sm"
                >
                  <div className="font-medium text-gray-900">
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
