import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Target,
  Users,
  Brain,
  Settings,
  LogOut,
  Menu,
  X,
  Wallet,
  ChevronRight,
} from "lucide-react";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
    email: "user@expenzo.com",
  };

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      emoji: "📊",
    },
    { path: "/expenses", label: "Expenses", icon: Receipt, emoji: "💸" },
    { path: "/analytics", label: "Analytics", icon: TrendingUp, emoji: "📈" },
    { path: "/budgets", label: "Budgets", icon: Target, emoji: "🎯" },
    { path: "/splits", label: "Splits", icon: Users, emoji: "💰" },
    { path: "/groups", label: "Groups", icon: Users, emoji: "👥" },
    { path: "/ai-insights", label: "AI Insights", icon: Brain, emoji: "🤖" },
    { path: "/settings", label: "Settings", icon: Settings, emoji: "⚙️" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userPreferences");
    navigate("/signin");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:overflow-y-auto lg:bg-slate-900 lg:border-r lg:border-slate-800">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Expenzo
              </h1>
              <p className="text-xs text-slate-500">Track Smart. Spend Bold.</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-primary-400" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-slate-800/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 overflow-y-auto lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Logo & Close Button */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                        Expenzo
                      </h1>
                      <p className="text-xs text-slate-500">
                        Track Smart. Spend Bold.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={toggleSidebar}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon className="w-5 h-5" />
                            <span className="flex-1 font-medium">
                              {item.label}
                            </span>
                            {isActive && (
                              <ChevronRight className="w-4 h-4 text-primary-400" />
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-800">
                  <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-slate-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-slate-400" />
            </button>

            {/* Page Title - Hidden on mobile, can be set dynamically */}
            <div className="hidden lg:block">
              <h2 className="text-xl font-semibold text-slate-100">
                Welcome back, {user.name?.split(" ")[0]}! 👋
              </h2>
            </div>

            {/* Mobile Logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Expenzo
              </span>
            </div>

            {/* Right Side - User Avatar & Quick Actions */}
            <div className="flex items-center gap-3">
              {/* Desktop User Info */}
              <div className="hidden lg:flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-200">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {JSON.parse(localStorage.getItem("userPreferences"))
                      ?.currency || "INR"}
                  </p>
                </div>
              </div>

              {/* Mobile User Avatar Only */}
              <div className="lg:hidden w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-73px)] bg-slate-950 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Render children or Outlet for nested routes */}
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
