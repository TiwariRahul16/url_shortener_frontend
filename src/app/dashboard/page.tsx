// src/app/dashboard/page.tsx

"use client";

import { useUrls } from "@/context/UrlContext";
import { ExternalLink, MousePointerClick, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Pull everything directly from our global Context!
  const { allUrls, totalUrls, totalClicks, loading, error } = useUrls();

  // The overview page only shows the 5 most recent links
  const recentUrls = allUrls.slice(0, 5);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back. Here is a summary of your links.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <LinkIcon size={24} />
            </div>
            <p className="text-gray-400 font-medium">Total Active URLs</p>
          </div>
          {loading ? (
            <div className="h-10 w-24 bg-gray-800 rounded animate-pulse mt-2"></div>
          ) : (
            <h2 className="text-4xl font-bold text-white">{totalUrls}</h2>
          )}
        </div>

        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <MousePointerClick size={24} />
            </div>
            <p className="text-gray-400 font-medium">Total Clicks (Recent)</p>
          </div>
          {loading ? (
            <div className="h-10 w-24 bg-gray-800 rounded animate-pulse mt-2"></div>
          ) : (
            <h2 className="text-4xl font-bold text-white">{totalClicks}</h2>
          )}
        </div>
      </div>

      {/* Recent Links */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Links</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800 animate-pulse flex flex-col gap-4">
                <div className="h-5 w-1/3 bg-gray-800 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : recentUrls.length === 0 ? (
          <div className="bg-gray-900/30 p-12 rounded-2xl border border-gray-800 border-dashed text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-500">
              <LinkIcon size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No links created yet</h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-6">
              You haven't shortened any URLs yet. Head over to the Links tab to create your first short link!
            </p>
            <Link href="/dashboard/links" className="bg-white text-black px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              Create a Link
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentUrls.map((url) => (
              <div key={url.id} className="group bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/urls/${url.shortCode}`} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-2 truncate">
                      {process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, '')}/api/urls/{url.shortCode}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <p className="text-sm text-gray-400 truncate flex items-center gap-2">
                    <span className="bg-gray-800 px-2 py-0.5 rounded text-xs">Original</span>
                    {url.originalUrl}
                  </p>
                </div>
                <div className="flex items-center sm:flex-col sm:items-end gap-2 text-sm bg-gray-950/50 px-4 py-2 rounded-xl border border-gray-800/50">
                  <span className="text-gray-400 font-medium">Clicks</span>
                  <span className="text-xl font-bold text-white">{url.totalClicks}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}