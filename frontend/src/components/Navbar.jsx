import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Plus,
  BarChart3,
  Users,
  User,
  LogOut,
  TrendingUp,
  Wallet,
} from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Navigation items for authenticated users
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Add Expense", href: "/add-expense", icon: Plus },
    { name: "Insights", href: "/insights", icon: BarChart3 },
    { name: "Groups", href: "/groups", icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-dark-100 shadow-sm border-b border-gray-200 dark:border-dark-300 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.svg"
                alt="Expenzo Logo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "inline";
                }}
              />
              <span
                className="text-2xl font-heading font-bold text-funky hidden"
                style={{ display: "none" }}
              >
                💸
              </span>
              <span className="text-xl font-heading font-bold text-funky">
                Expenzo
              </span>
            </Link>

            {/* Right side - Theme toggle and auth links */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link to="/login" className="btn-outline px-4 py-2">
                Sign In
              </Link>

              <Link to="/register" className="btn-primary px-4 py-2">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-dark-100 shadow-sm border-b border-gray-200 dark:border-dark-300 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img
              src="/logo.svg"
              alt="Expenzo Logo"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "inline";
              }}
            />
            <span
              className="text-2xl font-heading font-bold text-funky hidden"
              style={{ display: "none" }}
            >
              💸
            </span>
            <span className="text-xl font-heading font-bold text-funky">
              Expenzo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-button text-sm font-medium transition-all duration-200
                    ${
                      isActive(item.href)
                        ? "bg-primary-500 text-dark-base shadow-glow"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200"
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - Theme toggle and profile */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-button hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
              >
                <span className="text-xl">{user?.avatar || "👤"}</span>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-100 rounded-card shadow-float border border-gray-200 dark:border-dark-300"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-dark-300">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User size={16} />
                        <span>Profile Settings</span>
                      </Link>

                      <Link
                        to="/insights"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <TrendingUp size={16} />
                        <span>Spending Insights</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-button hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 dark:border-dark-300"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-button text-sm font-medium transition-all duration-200
                        ${
                          isActive(item.href)
                            ? "bg-primary-500 text-dark-base"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200"
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close menus */}
      {(isMobileMenuOpen || isProfileMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsProfileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
