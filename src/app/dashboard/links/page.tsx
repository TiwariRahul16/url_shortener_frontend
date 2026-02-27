// src/app/dashboard/links/page.tsx
"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useUrls } from "@/context/UrlContext";
import { Search, Plus, Copy, Check, Trash2, ExternalLink, Link as LinkIcon } from "lucide-react";

export default function LinksPage() {
  // Pull everything from Context instead of managing it locally!
  const { 
    urls, 
    page, 
    setPage, 
    totalPages, 
    search, 
    setSearch, 
    loading, 
    error: contextError,
    refreshData,
    optimisticDelete
  } = useUrls();

  // Local state only for the Create Form and Copy button
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsCreating(true);

    try {
      await api.post("/api/urls", {
        originalUrl,
        customAlias: customAlias.trim() || undefined,
      });

      setOriginalUrl("");
      setCustomAlias("");
      setSearch(""); // Clear search to ensure they see the new link
      setPage(1); // Go to page 1 to see the new link
      
      // Trigger a global refresh so Dashboard and Analytics also get the new link
      await refreshData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to create URL");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    
    try {
      // Instantly remove from UI for a snappy experience
      optimisticDelete(id);
      
      // Send delete request to backend
      await api.delete(`/api/urls/${id}`);
      
      // Refresh to ensure global stats (total urls/clicks) are perfectly in sync
      refreshData();
    } catch (err) {
      setFormError("Failed to delete link.");
      refreshData(); // Revert UI if the server request failed
    }
  };

  const handleCopy = (shortCode: string, id: string) => {
    const shortUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/urls/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const displayError = formError || contextError;

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Manage Links</h1>
        <p className="text-gray-400">Create, edit, and monitor your shortened URLs.</p>
      </div>

      {displayError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-400">
          {displayError}
        </div>
      )}

      {/* Create Form */}
      <form onSubmit={handleCreate} className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Plus size={20} className="text-blue-400"/> Create New Link
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input type="url" placeholder="https://your-long-url.com/example..." required value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition" disabled={isCreating} />
          </div>
          <div className="md:w-1/3">
            <input type="text" placeholder="Custom Alias (optional)" value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition" disabled={isCreating} />
          </div>
          <button type="submit" disabled={isCreating} className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition disabled:opacity-70 flex items-center justify-center min-w-[120px]">
            {isCreating ? "Creating..." : "Shorten"}
          </button>
        </div>
      </form>

      {/* Search and Filters */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input 
          type="text" 
          placeholder="Search links by original URL or alias..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="w-full p-3 pl-12 bg-gray-900/50 border border-gray-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition" 
        />
      </div>

      {/* URLs List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-900/30 rounded-2xl border border-gray-800 animate-pulse"></div>)}
        </div>
      ) : urls.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
          <LinkIcon className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-white">No links found</h3>
          <p className="text-gray-400 mt-1">
            {search ? "Try adjusting your search criteria." : "Create a new link above to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {urls.map((url) => (
            <div key={url.id} className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/urls/${url.shortCode}`} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-1 w-fit">
                  {process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, '')}/{url.shortCode}
                  <ExternalLink size={14} />
                </a>
                <p className="text-sm text-gray-400 truncate max-w-xl" title={url.originalUrl}>{url.originalUrl}</p>
                <div className="mt-3 text-xs text-gray-500 flex gap-4">
                  <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                  <span className="text-gray-400 font-medium">{url.totalClicks} clicks</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleCopy(url.shortCode, url.id)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition">
                  {copiedId === url.id ? <><Check size={16} className="text-green-400"/> Copied</> : <><Copy size={16}/> Copy</>}
                </button>
                <button onClick={() => handleDelete(url.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-4">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)} 
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-800 transition"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400 font-medium">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)} 
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-800 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}