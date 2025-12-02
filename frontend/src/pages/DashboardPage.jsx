import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  PieChart,
  Calendar,
  Plus,
  ArrowRight,
  DollarSign,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Activity,
  CreditCard,
} from "lucide-react";
import SpendingTrendChart from "../components/SpendingTrendChart";
import CategoryBreakdownChart from "../components/CategoryBreakdownChart";
import { useExpenses } from "../context/ExpenseContext";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { expenses, summary, fetchExpenses, loading } = useExpenses();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User" };
  const preferences = JSON.parse(localStorage.getItem("userPreferences")) || {
    currency: "INR",
  };

  // Feature 10: Dark/Light Mode Toggle
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || true
  );

  // Feature 9: Month Switcher
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Feature 1: Today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Month navigation
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Fetch expenses when component mounts or month changes
  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth, selectedYear]);

  // Feature 2 & 3: Quick Stats Cards & Real-Time Totals from API
  const summaryData = {
    totalSpent: summary?.totalAmount || 0,
    budget: 60000,
    monthlyIncome: 80000,
    walletBalance: 80000 - (summary?.totalAmount || 0),
    topCategory: { name: "Food & Dining", percentage: 35 },
    upcomingBills: 3,
  };

  const remaining = summaryData.budget - summaryData.totalSpent;
  const spentPercentage =
    summaryData.budget > 0
      ? (summaryData.totalSpent / summaryData.budget) * 100
      : 0;

  // Real-time calculations
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const currentDay = today.getDate();
  const dailyAverage =
    currentDay > 0 ? Math.round(summaryData.totalSpent / currentDay) : 0;
  const projectedMonthlyTotal = Math.round(dailyAverage * daysInMonth);

  // Feature 5: Daily spending data for bar chart from API
  const dailySpending = [];

  const maxDailyAmount =
    dailySpending.length > 0
      ? Math.max(...dailySpending.map((d) => d.amount))
      : 0;

  // Recent transactions from API - show last 5 expenses
  const recentTransactions = expenses.slice(0, 5).map((expense) => ({
    id: expense.id || expense._id,
    date: expense.date,
    category: expense.category,
    description: expense.description,
    amount: -Math.abs(expense.amount),
  }));

  const getCurrencySymbol = (currency) => {
    const symbols = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
      AED: "د.إ",
      JPY: "¥",
      AUD: "A$",
      CAD: "C$",
    };
    return symbols[currency] || "₹";
  };

  const currencySymbol = getCurrencySymbol(preferences.currency);

  const formatAmount = (amount) => {
    return `${currencySymbol}${Math.abs(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Feature 1: Welcome Header with Date & Feature 10: Dark/Light Mode Toggle */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-1">
            Hello {user.name?.split(" ")[0]} 👋, {formattedDate}
          </h1>
          <p className="text-slate-400">Here's your financial overview</p>
        </motion.div>

        {/* Dark/Light Mode Toggle */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-all duration-300 group"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
          )}
        </motion.button>
      </div>

      {/* Feature 9: Month Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4"
      >
        <button
          onClick={goToPreviousMonth}
          className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">
            {months[selectedMonth]} {selectedYear}
          </h3>
          <p className="text-xs text-slate-500">
            {selectedMonth === today.getMonth() &&
            selectedYear === today.getFullYear()
              ? "Current Month"
              : "Past Month"}
          </p>
        </div>
        <button
          onClick={goToNextMonth}
          disabled={
            selectedMonth === today.getMonth() &&
            selectedYear === today.getFullYear()
          }
          className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </motion.div>

      {/* Feature 2: Quick Stats Cards (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spent Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-xs text-red-400 font-medium">-12%</span>
          </div>
          <h3 className="text-xs text-slate-400 mb-1">Total Spent</h3>
          <p className="text-2xl font-bold text-white mb-2">
            {formatAmount(summaryData.totalSpent)}
          </p>
          <p className="text-xs text-slate-500">This month</p>
        </motion.div>

        {/* Remaining Budget Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-xs text-green-400 font-medium">
              {spentPercentage.toFixed(0)}%
            </span>
          </div>
          <h3 className="text-xs text-slate-400 mb-1">Remaining Budget</h3>
          <p className="text-2xl font-bold text-white mb-2">
            {formatAmount(remaining)}
          </p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${spentPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full ${
                spentPercentage > 80
                  ? "bg-red-500"
                  : spentPercentage > 60
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
          </div>
        </motion.div>

        {/* Monthly Income Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs text-blue-400 font-medium">+5%</span>
          </div>
          <h3 className="text-xs text-slate-400 mb-1">Monthly Income</h3>
          <p className="text-2xl font-bold text-white mb-2">
            {formatAmount(summaryData.monthlyIncome)}
          </p>
          <p className="text-xs text-slate-500">This month</p>
        </motion.div>

        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs text-purple-400 font-medium">●</span>
          </div>
          <h3 className="text-xs text-slate-400 mb-1">Wallet Balance</h3>
          <p className="text-2xl font-bold text-white mb-2">
            {formatAmount(summaryData.walletBalance)}
          </p>
          <p className="text-xs text-slate-500">Available now</p>
        </motion.div>
      </div>

      {/* Feature 3: Real-Time Totals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Daily Average</p>
            <p className="text-xl font-bold text-white">
              {formatAmount(dailyAverage)}
            </p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-secondary-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Projected Monthly Total</p>
            <p className="text-xl font-bold text-white">
              {formatAmount(projectedMonthlyTotal)}
            </p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Days Remaining</p>
            <p className="text-xl font-bold text-white">
              {daysInMonth - currentDay} days
            </p>
          </div>
        </div>
      </motion.div>

      {/* Features 4 & 5: Category Pie Chart + Daily/Weekly Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature 4: Category Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">
                Category Breakdown
              </h2>
              <p className="text-sm text-slate-500">
                Visual spending distribution
              </p>
            </div>
            <PieChart className="w-5 h-5 text-secondary-400" />
          </div>
          <CategoryBreakdownChart />
        </motion.div>

        {/* Feature 5: Daily/Weekly Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">
                Weekly Spending Pattern
              </h2>
              <p className="text-sm text-slate-500">Highest spending days</p>
            </div>
            <Activity className="w-5 h-5 text-primary-400" />
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-3 h-48">
            {dailySpending.map((day, index) => {
              const height = (day.amount / maxDailyAmount) * 100;
              const isHighest = day.amount === maxDailyAmount;
              return (
                <div
                  key={day.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <motion.div
                    className="w-full relative group cursor-pointer"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  >
                    <div
                      className={`w-full h-full rounded-t-lg transition-all duration-300 ${
                        isHighest
                          ? "bg-gradient-to-t from-red-600 to-red-400"
                          : "bg-gradient-to-t from-primary-600 to-primary-400 group-hover:from-primary-500 group-hover:to-primary-300"
                      }`}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-slate-700">
                        {formatAmount(day.amount)}
                      </div>
                    </div>
                    {isHighest && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                        <TrendingUp className="w-4 h-4 text-red-400 animate-bounce" />
                      </div>
                    )}
                  </motion.div>
                  <span
                    className={`text-xs font-medium ${
                      isHighest ? "text-red-400" : "text-slate-400"
                    }`}
                  >
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Feature 6: Recent Transactions List with Color Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">
              Recent Transactions
            </h2>
            <p className="text-sm text-slate-500">
              Last 5 expenses with categories
            </p>
          </div>
          {/* Feature 7: View All Transactions CTA */}
          <button
            onClick={() => navigate("/expenses")}
            className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium border border-primary-500/20"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Transactions List with Color Tags */}
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => {
            // Color tags based on category
            const getCategoryColor = (category) => {
              if (category.includes("Food"))
                return "bg-orange-500/20 text-orange-400 border-orange-500/30";
              if (category.includes("Transport"))
                return "bg-blue-500/20 text-blue-400 border-blue-500/30";
              if (category.includes("Shopping"))
                return "bg-purple-500/20 text-purple-400 border-purple-500/30";
              if (category.includes("Bills"))
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
              if (category.includes("Entertainment"))
                return "bg-pink-500/20 text-pink-400 border-pink-500/30";
              return "bg-slate-500/20 text-slate-400 border-slate-500/30";
            };

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all duration-200 group border border-slate-700/50"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {transaction.category.split(" ")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate mb-1">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-500">
                        {formatDate(transaction.date)}
                      </span>
                      <span className="text-xs text-slate-600">•</span>
                      {/* Color Tag for Category */}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(
                          transaction.category
                        )} font-medium`}
                      >
                        {transaction.category.replace(/[^\w\s]/gi, "").trim()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p
                    className={`text-lg font-bold ${
                      transaction.amount < 0 ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {transaction.amount < 0 ? "-" : "+"}
                    {formatAmount(transaction.amount)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Feature 8: Add Expense Quick Button (Floating) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/add-expense")}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-full shadow-2xl shadow-primary-500/50 flex items-center justify-center group z-50"
      >
        <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>
    </div>
  );
};

export default DashboardPage;
