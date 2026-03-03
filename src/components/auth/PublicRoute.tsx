// src/components/auth/PublicRoute.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If we are done loading and the user is already authenticated, send them to the dashboard
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  // Show a professional loading spinner while checking status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  // Prevent flashing the login form if they are about to be redirected
  if (isAuthenticated) {
    return null; 
  }

  return <>{children}</>;
}