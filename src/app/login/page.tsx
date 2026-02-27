// src/app/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PublicRoute from "@/components/auth/PublicRoute";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      // The PublicRoute component or AuthContext will automatically handle the redirect, 
      // but we can enforce it here for immediate feedback
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
      setIsSubmitting(false); // Only reset if there's an error, otherwise let the redirect happen
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
        <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-gray-800 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
            <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-white text-black font-medium p-3 rounded-lg hover:bg-gray-200 transition disabled:opacity-70 flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-white font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </PublicRoute>
  );
}