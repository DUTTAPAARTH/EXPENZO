import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  TrendingDown,
  Target,
  Zap,
  Award,
  BarChart3,
  Bell,
  RefreshCw,
  Users,
  Download,
  PieChart,
  Clock,
  TrendingUpIcon,
} from "lucide-react";
import axios from "axios";

const BudgetsPage = () => {
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showFeatures, setShowFeatures] = useState(false);

  // Budget data from API
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch budgets from API
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get("/api/budgets");
        if (response.data.success) {
          setBudgets(response.data.data.budgets || []);
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, []);

  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || b.limit || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;

  const getPercentage = (spent, limit) => {
    if (!limit) return 0;
    return Math.min((spent / limit) * 100, 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return "text-red-400";
    if (percentage >= 75) return "text-yellow-400";
    return "text-green-400";
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Food: "🍔",
      Transport: "🚗",
      Transportation: "🚗",
      Shopping: "🛍️",
      Entertainment: "🎬",
      Bills: "💰",
      "Bills & Utilities": "💰",
      Groceries: "🛒",
      Health: "🏥",
      "Health & Fitness": "🏥",
      Other: "📦",
    };
    return icons[category] || "💵";
  };

  // Featured budgets - budgets that need attention
  const featuredBudgets = budgets
    .map((b) => ({
      ...b,
      percentage: getPercentage(b.spent || 0, b.amount || b.limit),
    }))
    .filter((b) => b.percentage >= 75 || b.percentage <= 20)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  const regularBudgets = budgets.filter(
    (b) => !featuredBudgets.find((fb) => fb.id === b.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Budget Management
          </h1>
          <p className="text-slate-400">
            Track and manage your spending limits
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
          >
            <Zap className="w-5 h-5" />
            <span>Features</span>
          </button>
          <button
            onClick={() => setShowAddBudget(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Budget</span>
          </button>
        </div>
      </div>

      {/* Features Section */}
      <AnimatePresence>
        {showFeatures && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    ✨ Premium Features
                  </h2>
                  <p className="text-slate-400">
                    Powerful budgeting tools at your fingertips
                  </p>
                </div>
                <button
                  onClick={() => setShowFeatures(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Feature 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-primary-500/50 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Wallet className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">
                    💼 Create Category Budgets
                  </h3>
                  <p className="text-sm text-slate-400">
                    Set monthly/weekly budgets per category (Food, Rent, Transport) and track spend vs limit.
                  </p>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-green-500/50 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">
                    📊 Budget vs Spend Chart
                  </h3>
                  <p className="text-sm text-slate-400">
                    Visualize progress with an easy bar/area chart and % used.
                  </p>
                </motion.div>

                {/* Feature 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-yellow-500/50 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Bell className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">
                    🔔 Smart Alerts & Thresholds
                  </h3>
                  <p className="text-sm text-slate-400">
                    Get notifications at 50% / 80% / 100% of budget and custom thresholds.
                  </p>
                </motion.div>

                {/* Feature 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">
                    🎯 Savings Goals & Targets
                  </h3>
                  <p className="text-sm text-slate-400">
                    Create goals (e.g., "₹5,000 Vacation") and track progress toward them.
                  </p>
                </motion.div>

                {/* Feature 5 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-purple-500/50 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <RefreshCw className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">
                    ♻️ Rollover & Carryover
                  </h3>
                  <p className="text-sm text-slate-400">
                    Unspent budget can roll over to the next period or be locked.
                  </p>
                </motion.div>

                {/* Feature 6 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-pink-500/50 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-pink-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">
                    👥 Shared Budgets & Groups
                  </h3>
                  <p className="text-sm text-slate-400">
                    Create group budgets, invite members, and split contributions automatically.
                  </p>
                </motion.div>

                {/* Feature 7 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-teal-500/50 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-teal-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">
                    🔁 Recurring Budgets & Auto-adjust
                  </h3>
                  <p className="text-sm text-slate-400">
                    Auto-create monthly budgets and suggest adjustments based on past spend.
                  </p>
                </motion.div>

                {/* Feature 8 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-orange-500/50 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Download className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">
                    📥 Export & History
                  </h3>
                  <p className="text-sm text-slate-400">
                    Export budget reports (CSV/PDF) and view historical trends by period.
                  </p>
                </motion.div>
              </div>

              <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
                <p className="text-sm text-primary-300 text-center">
                  <Zap className="w-4 h-4 inline mr-2" />
                  All features are actively being developed and will be available soon!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-white">
            ₹{totalBudget.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-white">
            ₹{totalSpent.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Remaining</p>
          <p className="text-2xl font-bold text-white">
            ₹{totalRemaining.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {((totalRemaining / totalBudget) * 100).toFixed(1)}% left
          </p>
        </motion.div>
      </div>

      {/* Featured Budgets Section */}
      {featuredBudgets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <h2 className="text-2xl font-bold text-white">
              Featured Budgets
            </h2>
            <span className="text-sm text-slate-400">
              Needs your attention
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredBudgets.map((budget, index) => {
              const limit = budget.amount || budget.limit;
              const percentage = getPercentage(budget.spent || 0, limit);
              const remaining = limit - (budget.spent || 0);
              const isNearEmpty = percentage <= 20;
              const isOverBudget = percentage >= 100;
              const isWarning = percentage >= 90;

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                  }}
                  className={`relative overflow-hidden bg-gradient-to-br ${
                    isOverBudget
                      ? "from-red-900/40 to-red-800/20 border-red-500/50"
                      : isWarning
                      ? "from-yellow-900/40 to-yellow-800/20 border-yellow-500/50"
                      : "from-green-900/40 to-green-800/20 border-green-500/50"
                  } border-2 rounded-2xl p-6 hover:scale-105 transition-transform shadow-2xl`}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        isOverBudget
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : isWarning
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-green-500/20 text-green-300 border border-green-500/30"
                      }`}
                    >
                      {isOverBudget ? (
                        <>
                          <AlertTriangle className="w-3 h-3" /> EXCEEDED
                        </>
                      ) : isWarning ? (
                        <>
                          <AlertTriangle className="w-3 h-3" /> WARNING
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3" /> DOING GREAT
                        </>
                      )}
                    </div>
                  </div>

                  {/* Icon and Category */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl">{getCategoryIcon(budget.category)}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {budget.category}
                      </h3>
                      <p className="text-sm text-slate-300">
                        {budget.period || "Monthly"}
                      </p>
                    </div>
                  </div>

                  {/* Progress Circle */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 56 * (1 - percentage / 100)
                        }`}
                        className={
                          isOverBudget
                            ? "text-red-400"
                            : isWarning
                            ? "text-yellow-400"
                            : "text-green-400"
                        }
                        strokeLinecap="round"
                        style={{
                          transition: "stroke-dashoffset 1s ease-in-out",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className={`text-3xl font-bold ${
                          isOverBudget
                            ? "text-red-400"
                            : isWarning
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {percentage.toFixed(0)}%
                      </span>
                      <span className="text-xs text-slate-400">spent</span>
                    </div>
                  </div>

                  {/* Budget Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Spent</span>
                      <span className="text-lg font-bold text-white">
                        ₹{(budget.spent || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Budget</span>
                      <span className="text-lg font-semibold text-slate-300">
                        ₹{limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-px bg-slate-700" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">
                        {remaining >= 0 ? "Remaining" : "Over Budget"}
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          remaining >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        ₹{Math.abs(remaining).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-6">
                    <button className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regular Budget List */}
      {regularBudgets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6" />
            All Budgets
          </h2>

          {regularBudgets.map((budget, index) => {
            const limit = budget.amount || budget.limit;
            const percentage = getPercentage(budget.spent || 0, limit);
            const remaining = limit - (budget.spent || 0);

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getCategoryIcon(budget.category)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {budget.category}
                      </h3>
                      <p className="text-sm text-slate-400">
                        ₹{(budget.spent || 0).toLocaleString()} of ₹
                        {limit.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`text-right ${getStatusColor(percentage)}`}>
                      <p className="text-2xl font-bold">
                        {percentage.toFixed(0)}%
                      </p>
                      <p className="text-xs">spent</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 ml-4">
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${getProgressColor(percentage)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </div>

                {/* Budget Details */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-slate-500">Remaining</p>
                      <p
                        className={`font-semibold ${
                          remaining < 0 ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        ₹{Math.abs(remaining).toLocaleString()}
                        {remaining < 0 && " over"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Daily Avg</p>
                      <p className="font-semibold text-white">
                        ₹{Math.round((budget.spent || 0) / 30).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {percentage >= 90 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-medium text-red-400">
                        {percentage >= 100 ? "Budget Exceeded" : "Near Limit"}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {budgets.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No Budgets Yet
          </h3>
          <p className="text-slate-400 mb-6">
            Start by creating your first budget to track spending
          </p>
          <button
            onClick={() => setShowAddBudget(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Budget</span>
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading your budgets...</p>
        </div>
      )}

      {/* Add Budget Modal */}
      <AnimatePresence>
        {showAddBudget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBudget(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add New Budget</h2>
                <button
                  onClick={() => setShowAddBudget(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500">
                    <option>Select category</option>
                    <option>Food & Dining</option>
                    <option>Transportation</option>
                    <option>Shopping</option>
                    <option>Entertainment</option>
                    <option>Health & Fitness</option>
                    <option>Bills & Utilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Budget Limit
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="10,000"
                      className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddBudget(false)}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    Add Budget
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BudgetsPage;
