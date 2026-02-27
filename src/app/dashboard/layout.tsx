// src/app/dashboard/layout.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { UrlProvider } from "@/context/UrlContext";
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  UserCircle
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Links", href: "/dashboard/links", icon: LinkIcon },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  ];

  return (
    <ProtectedRoute>
      <UrlProvider>
        <div className="flex min-h-screen bg-gray-950 text-white font-sans">
          
          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 z-50">
            <h2 className="text-xl font-bold tracking-tight">SaaS URL</h2>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Sidebar */}
          <aside className={`
            fixed lg:static top-0 left-0 z-40 h-full w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0
            ${isMobileMenuOpen ? "translate-x-0 pt-20" : "-translate-x-full pt-6"}
          `}>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-8 hidden lg:block text-white">
                SaaS URL
              </h2>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-white text-black shadow-md font-medium"
                          : "text-gray-400 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      <Icon size={20} className={isActive ? "text-black" : "text-gray-400"} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Profile Section */}
            <div className="space-y-4 pt-6 border-t border-gray-800 mt-auto">
              {user && (
                <div className="flex items-center gap-3 px-2 text-sm text-gray-400">
                  <UserCircle size={24} className="text-gray-500" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-300">My Account</span>
                    <span className="text-xs">Role: {user.role}</span>
                  </div>
                </div>
              )}

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 bg-transparent border border-gray-700 text-gray-300 py-2.5 rounded-xl hover:bg-red-950 hover:text-red-400 hover:border-red-900 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Overlay for mobile when sidebar is open */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 w-full lg:max-w-[calc(100vw-16rem)] min-h-screen overflow-x-hidden pt-20 lg:pt-0">
            <div className="p-6 md:p-10 max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </UrlProvider>
    </ProtectedRoute>
  );
}