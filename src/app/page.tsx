// src/app/page.tsx

"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Link as LinkIcon, BarChart3, ShieldCheck, ArrowRight, Zap } from "lucide-react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <main className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar (Glassmorphism effect) */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/70 border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LinkIcon size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Shortify</span>
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              // Tiny skeleton loader for the button area
              <div className="w-24 h-9 bg-gray-800 animate-pulse rounded-lg"></div>
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition hidden sm:block"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-200 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <Zap size={14} />
          <span>The modern way to manage links</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
          Shorten Links. Track Performance. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Scale Smarter.
          </span>
        </h1>

        <p className="text-gray-400 max-w-2xl text-lg md:text-xl mb-10 leading-relaxed">
          A powerful enterprise-grade platform to create branded short links,
          monitor real-time click analytics, and optimize your digital reach.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 text-lg"
            >
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2 text-lg"
              >
                Start for free <ArrowRight size={20} />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-gray-900 border border-gray-800 text-white rounded-xl font-medium hover:bg-gray-800 hover:border-gray-700 transition flex items-center justify-center text-lg"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 border-t border-gray-900 bg-gray-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need in one place</h2>
            <p className="text-gray-400">Built for speed, reliability, and complete control over your links.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gray-900/50 rounded-3xl border border-gray-800 hover:border-gray-700 transition duration-300">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <LinkIcon className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Custom Aliases</h3>
              <p className="text-gray-400 leading-relaxed">
                Ditch random strings. Create branded, memorable short links tailored specifically to your audience and campaigns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gray-900/50 rounded-3xl border border-gray-800 hover:border-gray-700 transition duration-300">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Real-time Analytics</h3>
              <p className="text-gray-400 leading-relaxed">
                Stop guessing. Monitor clicks, track daily performance trends, and visualize data with beautiful interactive charts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gray-900/50 rounded-3xl border border-gray-800 hover:border-gray-700 transition duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Secure & Reliable</h3>
              <p className="text-gray-400 leading-relaxed">
                Enterprise-grade security with JWT authentication, Redis rate-limiting, and 99.9% uptime guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-950 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <LinkIcon size={16} className="text-gray-500" />
            <span className="font-semibold text-gray-300">Shortify</span>
          </div>
          <p>© {new Date().getFullYear()} Shortify Platform. Built for performance.</p>
        </div>
      </footer>

    </main>
  );
}