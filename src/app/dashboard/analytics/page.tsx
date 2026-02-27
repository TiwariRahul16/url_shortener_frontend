// src/app/dashboard/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useUrls } from "@/context/UrlContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MousePointerClick, TrendingUp } from "lucide-react";

interface Analytics {
  id: string;
  urlId: string;
  date: string;
  totalClicks: number;
}

export default function AnalyticsPage() {
  // Grab the global URLs list from our Context! No need to fetch them again.
  const { allUrls, loading: loadingUrls, error: contextError } = useUrls();
  
  const [selectedUrlId, setSelectedUrlId] = useState<string>("");
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState("");

  // Auto-select the first URL when the global allUrls array loads
  useEffect(() => {
    if (allUrls.length > 0 && !selectedUrlId) {
      setSelectedUrlId(allUrls[0].id);
    }
  }, [allUrls, selectedUrlId]);

  // Only fetch the specific graph data for the selected URL
  useEffect(() => {
    let isMounted = true;

    const fetchAnalyticsData = async (id: string) => {
      try {
        if (isMounted) setLoadingStats(true);
        const res = await api.get(`/api/analytics/${id}`);
        
        if (isMounted) {
          setAnalytics(res.data);
          setStatsError("");
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Analytics fetch stats error:", err.response?.data || err.message);
          setStatsError("Failed to load analytics data");
        }
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };

    if (selectedUrlId) {
      fetchAnalyticsData(selectedUrlId);
    }

    return () => { isMounted = false; };
  }, [selectedUrlId]);

  const chartData = analytics.map(item => ({
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    clicks: item.totalClicks
  })).reverse();

  const totalClicksSelected = analytics.reduce((sum, item) => sum + item.totalClicks, 0);
  
  const displayError = contextError || statsError;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Track the performance and engagement of your short links.</p>
      </div>

      {displayError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-400">
          {displayError}
        </div>
      )}

      {/* Select URL Dropdown */}
      <div className="mb-10 bg-gray-900/50 p-6 rounded-2xl border border-gray-800 shadow-sm">
        <label htmlFor="url-select" className="block mb-2 text-sm font-medium text-gray-300">
          Select a link to view stats
        </label>
        {loadingUrls ? (
          <div className="h-12 w-full bg-gray-800 rounded animate-pulse"></div>
        ) : (
          <select
            id="url-select"
            value={selectedUrlId}
            onChange={(e) => setSelectedUrlId(e.target.value)}
            className="w-full p-3 bg-gray-950 border border-gray-700 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition text-white"
          >
            {allUrls.length === 0 ? (
              <option value="">No URLs created yet</option>
            ) : (
              allUrls.map((url) => (
                <option key={url.id} value={url.id}>
                  {url.shortCode} - {url.originalUrl.substring(0, 50)}...
                </option>
              ))
            )}
          </select>
        )}
      </div>

      {/* Stats & Chart Container */}
      {!loadingUrls && selectedUrlId && (
        <div className="space-y-6">
          {loadingStats ? (
            <div className="h-96 bg-gray-900/30 rounded-2xl border border-gray-800 animate-pulse"></div>
          ) : analytics.length === 0 ? (
            <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-white">No click data yet</h3>
              <p className="text-gray-400 mt-1">Share your link to start generating analytics!</p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-br from-blue-900/20 to-gray-900/50 p-6 rounded-2xl border border-gray-800 shadow-sm flex items-center gap-6">
                <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl">
                  <MousePointerClick size={32} />
                </div>
                <div>
                  <p className="text-gray-400 font-medium mb-1">Total Clicks</p>
                  <h2 className="text-4xl font-bold text-white">{totalClicksSelected}</h2>
                </div>
              </div>

              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 shadow-sm">
                <h3 className="text-xl font-semibold mb-6 text-white">Clicks Over Time</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }} itemStyle={{ color: '#60A5FA' }} />
                      <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#1E3A8A', stroke: '#3B82F6', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}