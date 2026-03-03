// src/components/auth/ProtectedRoute.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Only redirect if we have finished loading and determined the user is not authenticated
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Show a professional loading spinner while verifying auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  // Double-check to prevent flashing content right before the redirect fires
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}