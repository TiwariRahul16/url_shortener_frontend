// src/context/UrlContext.tsx

"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export interface Url {
  id: string;
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  totalClicks: number;
}

interface UrlContextType {
  // Global Data
  urls: Url[];
  allUrls: Url[]; 
  totalUrls: number;
  totalClicks: number; 
  
  // Pagination & Search State
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  search: string;
  setSearch: (search: string) => void;
  
  // States
  loading: boolean;
  error: string;
  
  // Actions
  refreshData: () => Promise<void>;
  optimisticDelete: (id: string) => void;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  // Data States
  const [urls, setUrls] = useState<Url[]>([]);
  const [allUrls, setAllUrls] = useState<Url[]>([]);
  const [totalUrls, setTotalUrls] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // UI States
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // The master fetch function
  const fetchUrls = useCallback(async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) setLoading(true);
      setError("");

      const params: any = { page, limit: 10 };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const paginatedRes = await api.get("/api/urls/my", { params });
      const allRes = await api.get("/api/urls/my", { params: { page: 1, limit: 100 } });

      setUrls(paginatedRes.data.data);
      setTotalPages(paginatedRes.data.pagination.totalPages || 1);
      
      setAllUrls(allRes.data.data);
      setTotalUrls(allRes.data.pagination.total);
      
      const clicksSum = allRes.data.data.reduce((sum: number, url: Url) => sum + url.totalClicks, 0);
      setTotalClicks(clicksSum);

    } catch (err: any) {
      console.error("UrlContext Fetch Error:", err);
      if (!isBackgroundRefresh) setError("Failed to sync URLs with server.");
    } finally {
      if (!isBackgroundRefresh) setLoading(false);
    }
  }, [page, debouncedSearch]);

  // Initial fetch on mount / login / search change
  useEffect(() => {
    if (isAuthenticated) {
      fetchUrls();
    } else {
      setUrls([]);
      setAllUrls([]);
      setTotalUrls(0);
      setTotalClicks(0);
    }
  }, [isAuthenticated, fetchUrls]);

  // 🔥 NEW: Auto-refresh data (Polling & Window Focus)
  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Fetch silently when the user switches back to this browser tab
    const handleFocus = () => {
      fetchUrls(true); // true = background refresh (no loading spinner)
    };
    window.addEventListener("focus", handleFocus);

    // 2. Fetch silently every 30 seconds automatically
    const intervalId = setInterval(() => {
      fetchUrls(true); 
    }, 30000); // 30000 ms = 30 seconds

    return () => {
      // Cleanup when unmounting
      window.removeEventListener("focus", handleFocus);
      clearInterval(intervalId);
    };
  }, [isAuthenticated, fetchUrls]);

  const refreshData = async () => {
    await fetchUrls(true);
  };

  const optimisticDelete = (id: string) => {
    setUrls((prev) => prev.filter((u) => u.id !== id));
    setAllUrls((prev) => prev.filter((u) => u.id !== id));
    setTotalUrls((prev) => Math.max(0, prev - 1));
  };

  return (
    <UrlContext.Provider
      value={{
        urls,
        allUrls,
        totalUrls,
        totalClicks,
        page,
        setPage,
        totalPages,
        search,
        setSearch,
        loading,
        error,
        refreshData,
        optimisticDelete,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};

export const useUrls = () => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error("useUrls must be used within a UrlProvider");
  }
  return context;
};